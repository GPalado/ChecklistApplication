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
    this.existingLabels = this.navParams.get('labels') || [];
    database.object('/labels').valueChanges().subscribe(data => {
      if(data) {
        this.labels = Object.entries(data).map(([key, value]) => ({key,value}));
        console.log('labels ', this.labels);
        if(this.labels){
          const controls = this.labels.map(c => new FormControl(false));
          // todo make controls that exist true.
          for(let i in controls){
            console.log('control ', controls[i]);
            // if(this.existingLabels.includes(data[i].key))
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
