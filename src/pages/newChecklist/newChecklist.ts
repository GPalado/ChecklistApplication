import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-newChecklist',
  templateUrl: 'newChecklist.html'
})
export class NewChecklistPage {
  
  checklistInfo={}

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
  }

  save() {
    // todo save
    this.navCtrl.pop();
  }
  
}
