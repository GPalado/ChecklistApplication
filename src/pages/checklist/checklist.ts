import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EditChecklistPage } from '../editChecklist/editChecklist';
import { NewItemPage } from '../newItem/newItem';
import { ItemPage } from '../item/item';
import { AngularFireDatabase } from '../../../node_modules/angularfire2/database';
import 'rxjs/add/operator/take';

@Component({
  selector: 'page-checklist',
  templateUrl: 'checklist.html'
})
export class ChecklistPage {
  checklistData;
  itemKVPairs: any;
  checklistSubscription;
  itemsSubscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFireDatabase) { 
    var path = '/checklists/' + navParams.get('key');
    this.checklistSubscription = database.object(path).valueChanges().subscribe( clData => {
      this.checklistData = clData;
      console.log("Checklist data is " + clData);
      // todo populate KV pairs via checklist rather than via items [optimization]
      this.itemsSubscription = this.database.object('/items').valueChanges().subscribe(itemData => {
        var itemKVs = itemData;
        var checklistItemIDObj = this.checklistData.itemIDs;
        if(checklistItemIDObj !== undefined){
          var checklistItemIDs = Object.keys(checklistItemIDObj).map(key => checklistItemIDObj[key]);
          this.itemKVPairs = Object.keys(itemKVs)
          .filter(key => checklistItemIDs.includes(key))
          .reduce((obj, key) => {
            obj[key] = itemKVs[key];
            return obj;
          }, {});
          console.log("Filtered: ", this.itemKVPairs);
          console.log("Has " + Object.keys(this.itemKVPairs).length + " items");
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
  
  editChecklist() {
    this.navCtrl.push(EditChecklistPage, {
      checklistKey: this.navParams.get('key')
    });
  }

  deleteChecklist() {
    // todo alert for check make sure eetc things
    this.checklistSubscription.unsubscribe();
    this.itemsSubscription.unsubscribe();
    Object.keys(this.itemKVPairs).forEach( key => {
      console.log('Deleting ', this.itemKVPairs[key]);
      this.database.object('/items/' + key).remove();
    });
    console.log('Deleting checklist' + this.navParams.get('key'));
    this.database.object('/checklists/' + this.navParams.get('key')).remove();
    this.navCtrl.pop();
  }

  viewItem(itemKey) {
    this.navCtrl.push(ItemPage, {
      itemKey: itemKey,
      checklistKey: this.navParams.get('key')
    });
  }

  addNewItem() {
    this.navCtrl.push(NewItemPage, {
      checklistKey: this.navParams.get('key')
    });
  }
}
