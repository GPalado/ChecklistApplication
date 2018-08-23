import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewItemPage } from '../newItem/newItem';
import { ItemPage } from '../item/item';
import { AngularFireDatabase, AngularFireList } from '../../../node_modules/angularfire2/database';
import 'rxjs/add/operator/take';
import { ModifyChecklistPage } from '../modifyChecklist/modifyChecklist';
import { FormControl, FormGroup } from '../../../node_modules/@angular/forms';

@Component({
  selector: 'page-checklist',
  templateUrl: 'checklist.html'
})
export class ChecklistPage {
  checklistData;
  itemKVPairs: any;
  checklistSubscription;
  itemsSubscription;
  labels;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFireDatabase) {
    let path = '/checklists/' + navParams.get('key');
    this.checklistSubscription = database.object(path).valueChanges().subscribe( clData => {
      this.checklistData = clData;
      this.labels = clData['labels'];
      console.log('Checklist data is ', clData);
      console.log('labels ', this.labels);
      // todo populate KV pairs via checklist rather than via items [optimization]
      this.itemsSubscription = this.database.object('/items').valueChanges().subscribe(itemData => {
        let itemKVs = itemData;
        let checklistItemIDObj = this.checklistData.itemIDs;
        if(checklistItemIDObj){
          let checklistItemIDs = Object.keys(checklistItemIDObj).map(key => checklistItemIDObj[key]);
          if(itemKVs) {
            this.itemKVPairs = Object.keys(itemKVs)
            .filter(key => checklistItemIDs.includes(key))
            .reduce((obj, key) => {
              obj[key] = itemKVs[key];
              return obj;
            }, {});
          } else {
            this.itemKVPairs = [];
          }
          console.log("Filtered: ", this.itemKVPairs);
        } else {
          console.log("Checklist ItemIDs undefined");
          this.itemKVPairs = [];
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
    let submit = (formControl: FormControl, labels: any) => {
      this.database.object('/checklists/' + this.navParams.get('key'))
      .update({
        name: formControl.get('name').value,
        description: formControl.get('description').value
      });
      this.updateLabels(labels);
    };

    let clInfo;
    let checklistPath = '/checklists/' + this.navParams.get('key');
    this.database.object(checklistPath).valueChanges().take(1).subscribe(data => {
      clInfo = data;
      console.log('ClInfo ', data);
      this.navCtrl.push(ModifyChecklistPage, {
        pageName: 'Edit Checklist',
        submit: (formControl, labels) => submit(formControl, labels),
        checklistKey: this.navParams.get('key'),
        existingInfo: clInfo,
        existingLabels: this.labels
      });
    });
  }

  updateLabels(labels: any) {
    // overwrite existing labels: filter into labels to remove and labels to add
    console.log('Labels update ', labels); // labels is array of objects with {key: labelKey} as values
    let toRemove: any[] = [];
    let toAdd = [];
    let checklistLabels : AngularFireList<any> = this.database.list('/checklists/' + this.navParams.get('key') + '/labels');
    this.database.object('/checklists/' + this.navParams.get('key') + '/labels').valueChanges().take(1).subscribe(checklistLabelsObjs => {
      if(labels){
        toAdd = Object.keys(labels).map(key => labels[key]); // array of keys to add
        let existingLabelkey;
        for(existingLabelkey in checklistLabelsObjs) {
          if(!Object.keys(labels).map(key => labels[key]).includes(checklistLabelsObjs[existingLabelkey])){ // label needs to be removed from existing labels
            toRemove.push(checklistLabelsObjs[existingLabelkey]);
          } else { // label already exists, doesn't need to be readded
            let id = toAdd.indexOf(checklistLabelsObjs[existingLabelkey]);
            toAdd.splice(id, 1);
          }
        }
      } else { // no labels selected - clear labels
        console.log('No labels selected');
        toRemove = Object.keys(checklistLabelsObjs);
        checklistLabels.remove();
      }
      console.log('To Remove ', toRemove);
      console.log('To Add ', toAdd);
      toRemove.forEach(remove =>{
        this.database.object('/labels/' + remove + '/checklists').valueChanges().take(1).subscribe( labelChecklistsObj => {
          let checklistIDKey = Object.keys(labelChecklistsObj).find(key => labelChecklistsObj[key] === this.navParams.get('key'));
          console.log('checklist id key ', checklistIDKey);
          this.database.list('/labels/' + remove + '/checklists/' + checklistIDKey).remove();
          
          let labelIDKey = Object.keys(checklistLabelsObjs).find(key => checklistLabelsObjs[key] === remove);
          this.database.list('/checklists/' + this.navParams.get('key') + '/labels/'+ labelIDKey).remove();
        });
      });
      toAdd.forEach(add => {
        this.database.list('/labels/' + add + '/checklists').push(this.navParams.get('key'));
        this.database.list('/checklists/' + this.navParams.get('key') + '/labels/').push(add);
      });
    });
  }

  deleteChecklist() {
    // todo alert for check make sure etc things
    this.checklistSubscription.unsubscribe();
    this.itemsSubscription.unsubscribe();
    if(this.itemKVPairs) {
      Object.keys(this.itemKVPairs).forEach( key => {
        console.log('Deleting ', this.itemKVPairs[key]);
        this.database.object('/items/' + key).remove();
      });
    }
    console.log('Deleting checklist' + this.navParams.get('key'));
    this.database.object('/checklists/' + this.navParams.get('key')).remove();
    this.navCtrl.pop();
  }

  viewItem(itemKey) {
    console.log('Viewing item ', itemKey);
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
