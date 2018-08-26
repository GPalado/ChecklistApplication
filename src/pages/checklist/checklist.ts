import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { NewItemPage } from '../newItem/newItem';
import { AngularFireDatabase, AngularFireList } from '../../../node_modules/angularfire2/database';
import 'rxjs/add/operator/take';
import { ModifyChecklistPage } from '../modifyChecklist/modifyChecklist';
import { FormControl, FormGroup, FormBuilder, FormArray } from '../../../node_modules/@angular/forms';

@Component({
  selector: 'page-checklist',
  templateUrl: 'checklist.html'
})
export class ChecklistPage {
  itemKVPairs: any;
  checklistSubscription;
  checklistObj;
  checklistItemsObj;
  itemsSubscription;
  labelKeys;
  labels;
  formControl = this.formBuilder.group({
    items: new FormArray([])
  });
  itemsFormArray : FormArray;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFireDatabase, public alertCtrl: AlertController, public formBuilder: FormBuilder, public toastCtrl: ToastController) {
    let path = '/checklists/' + navParams.get('key');
    this.checklistSubscription = database.object(path).valueChanges().subscribe( clData => {
      this.checklistObj = clData;
      this.processChecklistObj();
    });
  }

  processChecklistObj() {
    console.log('Checklist ', this.checklistObj);
      this.labelKeys = this.checklistObj.labels;
      this.updateLabels(this.labelKeys);
      this.itemsSubscription = this.database.object('/items').valueChanges().subscribe(itemData => {
        this.checklistItemsObj = itemData;
        this.processChecklistItemsObj();
      });
      this.populateUI();
  }

  processChecklistItemsObj() {
    let checklistItemIDObj = this.checklistObj.itemIDs;
        if(checklistItemIDObj){
          let checklistItemIDs = Object.keys(checklistItemIDObj).map(key => checklistItemIDObj[key]);
          if(this.checklistItemsObj) {
            this.itemKVPairs = Object.keys(this.checklistItemsObj)
            .filter(key => checklistItemIDs.includes(key))
            .reduce((obj, key) => {
              obj[key] = this.checklistItemsObj[key];
              return obj;
            }, {});
          } else {
            this.itemKVPairs = [];
          }
          console.log("Filtered: ", this.itemKVPairs);
        } else {
          console.log("Checklist ItemIDs undefined");
          this.itemKVPairs = [];
        }
        this.setUpControls();
  }

  updateLabels(labelData){
    if(labelData){
      this.labels = labelData;
      this.labels = [];
      Object.keys(labelData).map(key => labelData[key]).forEach (labelKey => {
        this.database.object('/labels/' + labelKey).valueChanges().take(1).subscribe(labelData => {
          this.labels.push(labelData);
        });
      });
      console.log('labels', this.labels);
    }
  }

  controlsCompletedSetup(): boolean {
    if(this.itemsFormArray && this.itemKVPairs){
      return Object.keys(this.itemsFormArray['controls']).length == Object.keys(this.itemKVPairs).length*2;
    } 
    return false;
  }

  setUpControls() {
    let itemsControls = [];
    let innerCount = 0;
    let outerCount = 0;
    Object.keys(this.itemKVPairs).forEach( key => {
      let item = this.itemKVPairs[key];
      itemsControls[key] = new FormControl(item.content);
      let itemKey = Object.keys(this.itemKVPairs)[outerCount];
      this.database.object('/items/'+itemKey).valueChanges().take(1).subscribe(itemObj => {
        let isChecked = false;
        if(itemObj) {
          isChecked = itemObj['checked'];
        }
        itemsControls[key+innerCount] = new FormControl(isChecked);
        innerCount = innerCount + 1;
      });
      outerCount = outerCount + 1;
    });
    this.itemsFormArray = new FormArray(itemsControls);
    this.formControl = this.formBuilder.group({
      items: this.itemsFormArray
    });
  }

  populateUI() {
    document.getElementById("title").innerHTML = this.checklistObj.name;
    document.getElementById("description").innerHTML = this.checklistObj.description;
  }
  
  editChecklist() {
    let submit = (formControl: FormControl, labels: any) => {
      this.database.object('/checklists/' + this.navParams.get('key'))
      .update({
        name: formControl.get('name').value,
        description: formControl.get('description').value
      });
      this.updateDatabaseWithLabels(labels);
      const toast = this.toastCtrl.create({
        message: 'Checklist changes saved successfully',
        duration: 3000
      });
      toast.present();
    };

    this.navCtrl.push(ModifyChecklistPage, {
      pageName: 'Edit Checklist',
      submit: (formControl, labels) => submit(formControl, labels),
      checklistKey: this.navParams.get('key'),
      existingInfo: this.checklistObj,
      existingLabels: this.labelKeys
    });
  }

  updateDatabaseWithLabels(labels: any) {
    console.log('Labels update ', labels); // labels is array of objects with {key: labelKey} as values
    let toRemove: any[] = [];
    let toAdd = [];
    let checklistLabels : AngularFireList<any> = this.database.list('/checklists/' + this.navParams.get('key') + '/labels');
    this.database.object('/checklists/' + this.navParams.get('key') + '/labels').valueChanges().take(1).subscribe(checklistLabelsObjs => {
      if(labels){
        toAdd = Object.keys(labels).map(key => labels[key]); // array of keys to add
        let existingLabelkey;
        for(existingLabelkey in checklistLabelsObjs) {
          if(!Object.keys(labels).map(key => labels[key]).includes(checklistLabelsObjs[existingLabelkey])){ // label needs to be removed from existing labels
            toRemove.push(checklistLabelsObjs[existingLabelkey]);
          } else { // label already exists, doesn't need to be readded
            let id = toAdd.indexOf(checklistLabelsObjs[existingLabelkey]);
            toAdd.splice(id, 1);
          }
        }
      } else { // no labels selected - clear labels
        console.log('No labels selected');
        toRemove = Object.keys(checklistLabelsObjs);
        checklistLabels.remove();
      }
      console.log('To Remove ', toRemove);
      console.log('To Add ', toAdd);
      toRemove.forEach(remove => { //remove is key of label id in checklist
        let labelID = checklistLabelsObjs[remove];
        this.database.object('/labels/' + labelID + '/checklists').valueChanges().take(1).subscribe(labelChecklistsObj => {
          let checklistIDKey = Object.keys(labelChecklistsObj).find(key => labelChecklistsObj[key] === this.navParams.get('key'));
          this.database.list('/labels/' + labelID + '/checklists/' + checklistIDKey).remove();
          this.database.list('/checklists/' + this.navParams.get('key') + '/labels/'+ remove).remove();
        });
      });
      toAdd.forEach(add => {
        this.database.list('/labels/' + add + '/checklists').push(this.navParams.get('key'));
        this.database.list('/checklists/' + this.navParams.get('key') + '/labels/').push(add);
      });
    });
  }

  deleteChecklist() {
    const prompt = this.alertCtrl.create({
      title: 'Confirm',
      message: "Are you sure you want to delete this checklist?",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            console.log('Yes clicked');
            this.doDeleteChecklist();
          }
        }
      ]
    });
    prompt.present();
  }

  doDeleteChecklist() {
    this.checklistSubscription.unsubscribe();
    this.itemsSubscription.unsubscribe();
    this.updateDatabaseWithLabels(null);
    if(this.itemKVPairs) {
      Object.keys(this.itemKVPairs).forEach( key => {
        console.log('Deleting ', this.itemKVPairs[key]);
        this.doDeleteItem(key);
      });
    }
    console.log('Deleting checklist' + this.navParams.get('key'));
    this.database.object('/checklists/' + this.navParams.get('key')).remove();
    this.navCtrl.pop();
    const toast = this.toastCtrl.create({
      message: 'Checklist successfully deleted',
      duration: 3000
    });
    toast.present();
  }

  saveChanges() {
    let count = 0;
    Object.keys(this.itemKVPairs).forEach( key => {
      let newContent = this.itemsFormArray['controls'][key].value;
      let newChecked = this.itemsFormArray['controls'][key+count].value;
      if(newChecked === null) { newChecked = false; }
      this.database.object('/items/'+key).update({
        content: newContent,
        checked: newChecked
      });
      count = count + 1;
    });
    const toast = this.toastCtrl.create({
      message: 'Changes saved successfully',
      duration: 3000
    });
    toast.present();
  }

  deleteItem(itemKey) {
    const prompt = this.alertCtrl.create({
      title: 'Confirm',
      message: "Are you sure you want to delete this item?",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            console.log('Yes clicked');
            this.doDeleteItem(itemKey);
          }
        }
      ]
    });
    prompt.present();
  }

  doDeleteItem(itemKey) {
    this.database.object('/checklists/'+ this.navParams.get('key') +'/itemIDs').valueChanges().take(1).subscribe(itemIDs => {
      var itemIDKey = Object.keys(itemIDs).find(key => itemIDs[key] === itemKey);
      this.database.object('/items/' + itemKey).remove(); // remove item
      this.database.object('/checklists/' + this.navParams.get('key') + '/itemIDs/' + itemIDKey).remove(); // remove item reference
    });
    const toast = this.toastCtrl.create({
      message: 'Item successfully deleted',
      duration: 3000
    });
    toast.present();
  }

  addNewItem() {
    this.navCtrl.push(NewItemPage, {
      checklistKey: this.navParams.get('key')
    });
  }
}
