import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import { ChooseLabelsPage } from '../chooseLabels/chooseLabels';

@Component({
  selector: 'page-newChecklist',
  templateUrl: 'newChecklist.html'
})
export class NewChecklistPage {
  maxNameChars = 20;
  maxDescripChars = 60;
  checklists: AngularFireList<any>;
  
  formControl = this.formBuilder.group({
    name: ['', Validators.compose([Validators.maxLength(this.maxNameChars), Validators.required])],
    description: ['', Validators.compose([Validators.maxLength(this.maxDescripChars)])]
  });

  constructor(public navCtrl: NavController, public database: AngularFireDatabase, public formBuilder: FormBuilder) { 
    this.checklists = database.list('/checklists');
  }

  addLabels() {
    console.log('Add labels');
    this.navCtrl.push(ChooseLabelsPage);
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
    // this.checklistLabels = this.database.list('/checklists/' + newChecklistRef.key + '/labels');
    console.log('Save checklist ', newChecklistRef.key);
    this.navCtrl.pop();
  }
  
}
