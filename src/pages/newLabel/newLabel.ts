import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import {Validators, FormBuilder} from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'page-newLabel',
  templateUrl: 'newLabel.html'
})
export class NewLabelPage {
  maxChars = 20;
  labels: AngularFireList<any>;

  formControl = this.formBuilder.group({
    name: ['', Validators.compose([Validators.maxLength(this.maxChars), Validators.required])],
    labelCheckboxes: ['', Validators.compose([Validators.required])]
  });

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public database: AngularFireDatabase, public toastCtrl: ToastController) { 
    this.labels = database.list('/labels');
  }

  save() {
    const newLabelRef = this.labels.push({
      name: this.formControl.get('name').value
    });
    console.log('Save label ', newLabelRef.key);
    this.navCtrl.pop();
    const toast = this.toastCtrl.create({
      message: 'New label successfully created',
      duration: 3000
    });
    toast.present();
  }
  
}
