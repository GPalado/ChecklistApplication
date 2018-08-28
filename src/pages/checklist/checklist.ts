import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { NewItemPage } from '../newItem/newItem';
import { AngularFireDatabase, AngularFireList } from '../../../node_modules/angularfire2/database';
import 'rxjs/add/operator/take';
import { ModifyChecklistPage } from '../modifyChecklist/modifyChecklist';
import { FormControl, FormGroup, FormBuilder, FormArray } from '../../../node_modules/@angular/forms';
import { DatabaseService } from '../../app/database.service';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public databaseService: DatabaseService, public alertCtrl: AlertController, public formBuilder: FormBuilder, public toastCtrl: ToastController) {
    this.checklistSubscription = databaseService.getChecklist(navParams.get('key')).subscribe( clData => {
      this.checklistObj = clData;
      this.processChecklistObj();
    });
  }

  processChecklistObj() {
    console.log('Checklist ', this.checklistObj);
      this.labelKeys = this.checklistObj.labels;
      this.updateLabels(this.labelKeys);
      this.itemsSubscription = this.databaseService.getItemsObj().subscribe(itemData => {
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
        this.databaseService.getLabel(labelKey).take(1).subscribe(labelData => {
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
      this.databaseService.getItem(itemKey).take(1).subscribe(itemObj => {
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
      this.databaseService.updateChecklist(this.navParams.get('key'),
      {
        name: formControl.get('name').value,
        description: formControl.get('description').value
      });
      this.databaseService.updateChecklistWithLabels(this.navParams.get('key'), labels);
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
    console.log('Deleting checklist' + this.navParams.get('key'));
    this.databaseService.deleteChecklist(this.navParams.get('key'));
    this.navCtrl.goToRoot({});
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
      this.databaseService.updateItem(key, {
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
    this.databaseService.deleteItemFromChecklist(itemKey, this.navParams.get('key'), true);
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
