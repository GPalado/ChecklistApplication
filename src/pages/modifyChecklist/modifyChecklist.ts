import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {Validators, FormBuilder} from '@angular/forms';
import { ChooseLabelsPage } from '../chooseLabels/chooseLabels';

@IonicPage()
@Component({
  selector: 'page-modifyChecklist',
  templateUrl: 'modifyChecklist.html',
})
export class ModifyChecklistPage {
  maxNameChars = 20;
  maxDescripChars = 60;
  checklists: AngularFireList<any>;
  labels: any;
  formControl = this.formBuilder.group({
    name: ['', Validators.compose([Validators.maxLength(this.maxNameChars), Validators.required])],
    description: ['', Validators.compose([Validators.maxLength(this.maxDescripChars)])]
  });
  submit: Function;
  pageName;


  constructor(public navCtrl: NavController, public navParams : NavParams, public database: AngularFireDatabase, public formBuilder: FormBuilder) { 
    this.pageName = navParams.get('pageName');
    this.checklists = database.list('/checklists');
    this.submit = navParams.get('submit');
    var existingInfo = navParams.get('existingInfo');
    if(existingInfo !== undefined) {
      console.log('Existing ', existingInfo);
      this.formControl.controls['name'].setValue(existingInfo['name']);
      this.formControl.controls['description'].setValue(existingInfo['description']);
    }
    var existingLabels = navParams.get('existingLabels');
    if(existingLabels){
      this.labels = existingLabels;
    }
  }

  addLabels() {
    var getLabels = (data) => {
      this.labels = data;
    };
    this.navCtrl.push(ChooseLabelsPage, {
        existingLabels: this.labels,
        callback: getLabels
    });
  }

  save() {
    this.submit(this.formControl, this.labels);
    this.navCtrl.pop();
  }
}
