import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EditChecklistPage } from '../editChecklist/editChecklist';
import { NewItemPage } from '../newItem/newItem';
import { ItemPage } from '../item/item';
import { AngularFireDatabase } from '../../../node_modules/angularfire2/database';
import { Observable } from '../../../node_modules/rxjs';
import 'rxjs/add/operator/take';

@Component({
  selector: 'page-checklist',
  templateUrl: 'checklist.html'
})
export class ChecklistPage {
  checklistData;
  items: object[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFireDatabase) { 
    var path = '/checklists/' + navParams.get('key');
    database.object(path).valueChanges().take(1).subscribe( data => {
      this.checklistData = data;
      console.log(data);
      this.populateUI();
      this.populateIDs();
    });
  }

  populateUI() {
    document.getElementById("title").innerHTML = this.checklistData.name;
    document.getElementById("description").innerHTML = this.checklistData.description;
  }

  populateIDs() {
    var itemID;
    for(itemID in this.checklistData.itemIDs) {
      // take 1 here or remain subscribed
      this.database.object('/items/' + itemID).valueChanges().take(1).subscribe( data => {
        this.items.push(data);
        console.log(data);
      });
    }
    // todo update cards
  }
  
  editChecklist() {
    this.navCtrl.push(EditChecklistPage, {
      key: this.navParams.get('key')
    });
  }

  deleteChecklist() {
    // todo alert for check make sure eetc things
    this.navCtrl.pop();
  }

  viewItem(itemKey) {
    this.navCtrl.push(ItemPage, {
      key: itemKey
    });
  }

  addNewItem() {
    this.navCtrl.push(NewItemPage, {
      checklistKey: this.navParams.get('key')
    });
  }
}
