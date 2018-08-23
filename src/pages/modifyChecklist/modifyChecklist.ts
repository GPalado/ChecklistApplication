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
  labelKeys: any;
  labels = [];
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
      this.formControl.controls['name'].setValue(existingInfo['name']);
      this.formControl.controls['description'].setValue(existingInfo['description']);
    }
    var existingLabels = navParams.get('existingLabels');
    console.log('existing labels', existingLabels);
    this.updateLabels(existingLabels);
  }

  updateLabels(labelData){
    console.log('label data', labelData);
    if(labelData){
      this.labelKeys = labelData;
      this.labels = [];
      Object.keys(labelData).map(key => labelData[key]).forEach (labelKey => {
        this.database.object('/labels/' + labelKey).valueChanges().take(1).subscribe(labelData => {
          this.labels.push(labelData);
        });
      });
      console.log('labels', this.labels);
    }
  }

  addLabels() {
    var getLabels = (data) => {
      this.updateLabels(data);
    };
    this.navCtrl.push(ChooseLabelsPage, {
        existingLabels: this.labelKeys,
        callback: getLabels,
        checklistKey: this.navParams.get('checklistKey')
    });
  }

  save() {
    this.submit(this.formControl, this.labelKeys);
    this.navCtrl.pop();
  }
}
