import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'page-newItem',
  templateUrl: 'newItem.html'
})
export class NewItemPage {
  maxChars = 200;
  items: AngularFireList<any>;
  
  formControl = this.formBuilder.group({
    content: ['', Validators.compose([Validators.maxLength(this.maxChars), Validators.required])]
  });

  constructor(public navCtrl: NavController, public navParams: NavParams, database: AngularFireDatabase, public formBuilder: FormBuilder) { 
    this.items = database.list('/items');
  }

  save() {
    const newItemRef = this.items.push({
      content: this.formControl.get('content').value
    });
    //todo add reference to parent checklist
    this.navCtrl.pop();
  }
  
}
