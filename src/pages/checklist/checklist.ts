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
  itemKVPairs: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFireDatabase) { 
    var path = '/checklists/' + navParams.get('key');
    database.object(path).valueChanges().subscribe( clData => {
      this.checklistData = clData;
      console.log("Checklist data is " + clData);
      this.populateItems().subscribe(itemData => {
        var itemKVs = itemData;
        console.log("itemData:" + itemKVs);
        var checklistItemIDObj = this.checklistData.itemIDs;
        if(checklistItemIDObj !== undefined){
          var checklistItemIDs = Object.keys(checklistItemIDObj).map(key => checklistItemIDObj[key]);
          this.itemKVPairs = Object.keys(itemKVs)
          .filter(key => checklistItemIDs.includes(key))
          .reduce((obj, key) => {
            obj[key] = itemKVs[key];
            return obj;
          }, {});
          console.log("filtered: "+ this.itemKVPairs + " has " + Object.keys(this.itemKVPairs).length + " items");
        } else {
          console.log("Checklist ItemIDs undefined");
        }
      });
      this.populateUI();
    });
  }

  populateUI() {
    document.getElementById("title").innerHTML = this.checklistData.name;
    document.getElementById("description").innerHTML = this.checklistData.description;
  }

  populateItems() {
    return this.database.object('/items').valueChanges();
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
      itemKey: itemKey
    });
  }

  addNewItem() {
    this.navCtrl.push(NewItemPage, {
      checklistKey: this.navParams.get('key')
    });
  }
}
