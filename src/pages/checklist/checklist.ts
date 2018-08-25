import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
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
  checklistData;
  itemKVPairs: any;
  checklistSubscription;
  itemsSubscription;
  labelKeys;
  labels;
  formControl = this.formBuilder.group({
    items: new FormArray([])
  });
  itemsFormArray : FormArray;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFireDatabase, public alertCtrl: AlertController, public formBuilder: FormBuilder) {
    let path = '/checklists/' + navParams.get('key');
    this.checklistSubscription = database.object(path).valueChanges().subscribe( clData => {
      this.checklistData = clData;
      this.labelKeys = clData['labels'];
      this.updateLabels(this.labelKeys);
      console.log('Checklist ', clData);
      console.log('labels ', this.labels);
      this.itemsSubscription = this.database.object('/items').valueChanges().subscribe(itemData => {
        let itemKVs = itemData;
        let checklistItemIDObj = this.checklistData.itemIDs;
        if(checklistItemIDObj){
          let checklistItemIDs = Object.keys(checklistItemIDObj).map(key => checklistItemIDObj[key]);
          if(itemKVs) {
            this.itemKVPairs = Object.keys(itemKVs)
            .filter(key => checklistItemIDs.includes(key))
            .reduce((obj, key) => {
              obj[key] = itemKVs[key];
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
      });
      this.populateUI();
    });
  }

  updateLabels(labelData){
    console.log('label data', labelData);
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
      console.log('eky', key);
      let itemKey = Object.keys(this.itemKVPairs)[outerCount];
      console.log('itemkey', itemKey);
      this.database.object('/items/'+itemKey).valueChanges().take(1).subscribe(itemObj => {
        console.log('item', itemObj);
        let isChecked = itemObj['checked'];
        console.log('checked ', isChecked);
        itemsControls[key+innerCount] = new FormControl(isChecked);
        innerCount = innerCount + 1;
      });
      outerCount = outerCount + 1;
    });
    this.itemsFormArray = new FormArray(itemsControls);
    this.formControl = this.formBuilder.group({
      items: this.itemsFormArray
    });
    console.log('itemsformarray', this.itemsFormArray);
  }

  populateUI() {
    document.getElementById("title").innerHTML = this.checklistData.name;
    document.getElementById("description").innerHTML = this.checklistData.description;
  }
  
  editChecklist() {
    let submit = (formControl: FormControl, labels: any) => {
      this.database.object('/checklists/' + this.navParams.get('key'))
      .update({
        name: formControl.get('name').value,
        description: formControl.get('description').value
      });
      this.updateDatabaseWithLabels(labels);
    };

    let clInfo;
    let checklistPath = '/checklists/' + this.navParams.get('key');
    this.database.object(checklistPath).valueChanges().take(1).subscribe(data => {
      clInfo = data;
      console.log('ClInfo ', data);
      this.navCtrl.push(ModifyChecklistPage, {
        pageName: 'Edit Checklist',
        submit: (formControl, labels) => submit(formControl, labels),
        checklistKey: this.navParams.get('key'),
        existingInfo: clInfo,
        existingLabels: this.labelKeys
      });
    });
  }

  updateDatabaseWithLabels(labels: any) {
    // overwrite existing labels: filter into labels to remove and labels to add
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
      toRemove.forEach(remove =>{
        this.database.object('/labels/' + remove + '/checklists').valueChanges().take(1).subscribe( labelChecklistsObj => {
          let checklistIDKey = Object.keys(labelChecklistsObj).find(key => labelChecklistsObj[key] === this.navParams.get('key'));
          this.database.list('/labels/' + remove + '/checklists/' + checklistIDKey).remove();
          
          let labelIDKey = Object.keys(checklistLabelsObjs).find(key => checklistLabelsObjs[key] === remove);
          this.database.list('/checklists/' + this.navParams.get('key') + '/labels/'+ labelIDKey).remove();
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
    if(this.itemKVPairs) {
      Object.keys(this.itemKVPairs).forEach( key => {
        console.log('Deleting ', this.itemKVPairs[key]);
        this.database.object('/items/' + key).remove();
      });
    }
    console.log('Deleting checklist' + this.navParams.get('key'));
    this.database.object('/checklists/' + this.navParams.get('key')).remove();
    this.navCtrl.pop();
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
    //todo message saying changes saved
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
    this.database.object('/checklists/'+ this.navParams.get('key') +'/itemIDs').valueChanges().subscribe(itemIDs => {
      var itemIDKey = Object.keys(itemIDs).find(key => itemIDs[key] === itemKey);
      this.database.object('/items/' + itemKey).remove(); // remove item
      this.database.object('/checklists/' + this.navParams.get('key') + '/itemIDs/' + itemIDKey).remove(); // remove item reference
    });
  }

  addNewItem() {
    this.navCtrl.push(NewItemPage, {
      checklistKey: this.navParams.get('key')
    });
  }
}
