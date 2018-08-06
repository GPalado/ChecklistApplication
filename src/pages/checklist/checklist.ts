import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EditChecklistPage } from '../editChecklist/editChecklist';
import { NewItemPage } from '../newItem/newItem';
import { ItemPage } from '../item/item';

@Component({
  selector: 'page-checklist',
  templateUrl: 'checklist.html'
})
export class ChecklistPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
  }
  
  editChecklist() {
    this.navCtrl.push(EditChecklistPage);
  }

  deleteChecklist() {
    // todo alert for check make sure eetc things
    this.navCtrl.pop();
  }

  viewItem() {
    this.navCtrl.push(ItemPage);
  }

  addNewItem() {
    this.navCtrl.push(NewItemPage);
  }
}
