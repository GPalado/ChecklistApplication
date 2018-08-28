import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireList } from 'angularfire2/database';
import {Validators, FormBuilder } from '@angular/forms';
import { DatabaseService } from '../../app/database.service';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, databaseService: DatabaseService, public formBuilder: FormBuilder, public toastCtrl: ToastController) { 
    this.items = databaseService.getItemsList();
    this.itemIDs = databaseService.getChecklistItemIDsList(this.navParams.get('checklistKey'));
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
