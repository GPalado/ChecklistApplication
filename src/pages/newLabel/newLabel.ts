import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-newLabel',
  templateUrl: 'newLabel.html'
})
export class NewLabelPage {

  labelInfo={}

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
  }

  save() {
    // todo save
    this.navCtrl.pop();
  }
  
}
