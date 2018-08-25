import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'page-newItem',
  templateUrl: 'newItem.html'
})
export class NewItemPage {
  maxChars = 200;
  items: AngularFireList<any>;
  itemIDs: AngularFireList<any>;
  
  formControl = this.formBuilder.group({
    content: ['', Validators.compose([Validators.maxLength(this.maxChars), Validators.required])]
  });

  constructor(public navCtrl: NavController, public navParams: NavParams, database: AngularFireDatabase, public formBuilder: FormBuilder, public toastCtrl: ToastController) { 
    this.items = database.list('/items');
    this.itemIDs = database.list('/checklists/' + this.navParams.get('checklistKey') + '/itemIDs');
    console.log(this.navParams.get('checklistKey'));
  }

  save() {
    const newItemRef = this.items.push({
      content: this.formControl.get('content').value
    });
    this.itemIDs.push(newItemRef.key);
    this.navCtrl.pop();
    const toast = this.toastCtrl.create({
      message: 'Item successfully created',
      duration: 3000
    });
    toast.present();
  }
  
}
