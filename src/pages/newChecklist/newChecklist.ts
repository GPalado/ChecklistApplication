import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';

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

  constructor(public navCtrl: NavController, database: AngularFireDatabase, public formBuilder: FormBuilder) { 
    this.checklists = database.list('/checklists');
  }

  save() {
    // todo labels
    var descrip = this.formControl.get('description');
    if(descrip===undefined){
      descrip="";
    }
    const newChecklistRef = this.checklists.push({
      name: this.formControl.get('name').value,
      description: descrip
    });
    this.navCtrl.pop();
  }
  
}
