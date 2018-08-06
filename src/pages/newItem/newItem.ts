import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-newItem',
  templateUrl: 'newItem.html'
})
export class NewItemPage {

  itemInfo={}

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
  }

  save() {
    // todo save
    this.navCtrl.pop();
  }
  
}
