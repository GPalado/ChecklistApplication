import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import {Validators, FormBuilder} from '@angular/forms';
import { AngularFireList } from 'angularfire2/database';
import { DatabaseService } from '../../app/database.service';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, public databaseService: DatabaseService, public toastCtrl: ToastController) { 
    this.labels = databaseService.getLabelsList();
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
