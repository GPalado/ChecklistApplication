import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {Validators, FormBuilder} from '@angular/forms';
import { ChooseLabelsPage } from '../chooseLabels/chooseLabels';

@Component({
  selector: 'page-newChecklist',
  templateUrl: 'newChecklist.html'
})
export class NewChecklistPage {
  maxNameChars = 20;
  maxDescripChars = 60;
  checklists: AngularFireList<any>;
  labels: any;
  
  formControl = this.formBuilder.group({
    name: ['', Validators.compose([Validators.maxLength(this.maxNameChars), Validators.required])],
    description: ['', Validators.compose([Validators.maxLength(this.maxDescripChars)])]
  });

  constructor(public navCtrl: NavController, public database: AngularFireDatabase, public formBuilder: FormBuilder) { 
    this.checklists = database.list('/checklists');
  }

  addLabels() {
    console.log('Add labels');
    var getLabels = data =>
      {
        return new Promise((resolve, reject) => {
          this.labels = data;
          resolve();
        });
      };
    this.navCtrl.push(ChooseLabelsPage,
      {
          labels: this.labels,
          callback: getLabels
      });
  }

  save() {
    var descrip = this.formControl.get('description').value;
    if(descrip===undefined){
      descrip="";
    }
    const newChecklistRef = this.checklists.push({
      name: this.formControl.get('name').value,
      description: descrip
    });
    var checklistLabels : AngularFireList<any> = this.database.list('/checklists/' + newChecklistRef.key + '/labels');
    var key;
    for(key in Object.keys(this.labels)) {
      checklistLabels.push(this.labels[key].key);
      var labelChecklists : AngularFireList<any> = this.database.list('/labels/' + this.labels[key].key + '/checklists');
      labelChecklists.push(newChecklistRef.key);
    }
    
    console.log('Save checklist ', newChecklistRef);
    this.navCtrl.pop();
  }
  
}
