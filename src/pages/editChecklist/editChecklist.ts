import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-editChecklist',
  templateUrl: 'editChecklist.html'
})
export class EditChecklistPage {
  checklistInfo={}

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    // todo set content of form to be existing data
  }

  update() {
    // todo update
    this.navCtrl.pop();
  }
  
}
