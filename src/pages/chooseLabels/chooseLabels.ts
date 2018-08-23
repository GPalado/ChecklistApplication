import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NewLabelPage } from '../newLabel/newLabel';
import { AngularFireDatabase } from '../../../node_modules/angularfire2/database';
import {FormBuilder, FormGroup, FormControl, FormArray} from '@angular/forms';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFireDatabase, public formBuilder: FormBuilder) {
    this.callback = this.navParams.get('callback');
    this.existingLabels = this.navParams.get('existingLabels') || [];
    console.log('existing labels ', this.existingLabels); // object of kv pairs
    database.object('/labels').valueChanges().subscribe(data => {
      if(data) {
        console.log('data ', data); // object of kv pairs
        this.labels = Object.entries(data).map(([key, value]) => ({key,value}));
        console.log('labels ', this.labels); // array of objects
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
    console.log('Add new label');
    this.navCtrl.push(NewLabelPage);
  }

  submit() {
    const selected = this.formControl.value.labels
      .map((v, i) => v ? this.labels[i] : null)
      .filter(v => v !== null);

    console.log('Selected ', selected);
    this.callback(selected);
    this.navCtrl.pop();
  }

}
