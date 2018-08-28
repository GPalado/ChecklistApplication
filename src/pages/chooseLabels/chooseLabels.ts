import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import {FormBuilder, FormGroup, FormControl, FormArray} from '@angular/forms';
import { DatabaseService } from '../../app/database.service';

@IonicPage()
@Component({
  selector: 'page-chooseLabels',
  templateUrl: 'chooseLabels.html',
})
export class ChooseLabelsPage {
  labels: any;
  formControl: FormGroup;
  callback: Function;
  existingLabels = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public databaseService: DatabaseService, public alertCtrl: AlertController, public formBuilder: FormBuilder, public toastCtrl: ToastController) {
    this.callback = this.navParams.get('callback');
    this.existingLabels = this.navParams.get('existingLabels') || []; // object of kv pairs
    databaseService.getLabelsObj().subscribe(data => {
      console.log('labels update', data);
      if(data) { // object of kv pairs
        this.labels = Object.entries(data).map(([key, value]) => ({key,value})); // array of objects
        if(this.labels){
          const controls = this.labels.map(c => new FormControl(false));
          for(let i in controls){
            if(Object.keys(this.existingLabels).map(key => this.existingLabels[key]).includes(Object.keys(data)[i])){
              controls[i].value = true;
            }
          }
          this.formControl = this.formBuilder.group({
            labels: new FormArray(controls)
          });
        }
      }
    });
  }

  addNewLabel() {
    const prompt = this.alertCtrl.create({
      title: 'New Label',
      message: "Enter the name of this new label",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
            this.doSaveLabel(data);
          }
        }
      ]
    });
    prompt.present();
  }

  doSaveLabel(data: object) {
    let labels = this.databaseService.getLabelsList();
    const newLabelRef = labels.push({
      name: data['name']
    });
    console.log('Save label ', newLabelRef.key);
    const toast = this.toastCtrl.create({
      message: 'New label successfully created',
      duration: 3000
    });
    toast.present();
  }

  submit() {
    const selected = this.formControl.value.labels
      .map((v, i) => v ? this.labels[i] : null)
      .filter(v => v !== null);

    console.log('Selected ', selected);
    let toReturn = {};
    for(let i in selected){
      toReturn[i] = selected[i].key;
    }
    console.log('returning ', toReturn);
    this.callback(toReturn);
    this.navCtrl.pop();
  }

}
