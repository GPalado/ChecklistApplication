import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'page-editChecklist',
  templateUrl: 'editChecklist.html'
})
export class EditChecklistPage {
  maxNameChars = 20;
  maxDescripChars = 60;
  checklists: AngularFireList<any>;
  
  formControl = this.formBuilder.group({
    name: ['', Validators.compose([Validators.maxLength(this.maxNameChars), Validators.required])],
    description: ['', Validators.compose([Validators.maxLength(this.maxDescripChars)])]
  });

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFireDatabase, public formBuilder: FormBuilder) { 
    var checklistPath = '/checklists/' + navParams.get('checklistKey');
    database.object(checklistPath).valueChanges().take(1).subscribe(data => {
      this.formControl.controls['name'].setValue(data['name']);
      this.formControl.controls['description'].setValue(data['description']);
    });
  }

  save() {
    //todo labels
    this.database.object('/checklists/' + this.navParams.get('checklistKey'))
    .update({
      name: this.formControl.get('name').value,
      description: this.formControl.get('description').value
    });
    this.navCtrl.pop();
  }
  
}
