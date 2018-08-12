import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'page-item',
  templateUrl: 'item.html'
})
export class ItemPage {
  maxChars = 200;
  items: AngularFireList<any>;
  itemIDs: AngularFireList<any>;

  formControl = this.formBuilder.group({
    content: ['', Validators.compose([Validators.maxLength(this.maxChars), Validators.required])]
  });

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFireDatabase, public formBuilder: FormBuilder) { 
    this.items = database.list('/items');
    this.itemIDs = database.list('/checklists/' + this.navParams.get('checklistKey') + '/itemIDs');
    var path = '/items/' + navParams.get('itemKey');
    database.object(path).valueChanges().subscribe(data => {
      this.formControl.controls['content'].setValue(data['content']);
    });
  }

  deleteItem() {
    // todo alert for check make sure eetc things
    // todo remove reference in checklist CHECK THIS WORKS
    // var itemIDKey = (_.invert(this.database.object('checklists/' + this.navParams.get('checklistKey') + '/itemIDs/')))[this.navParams.get('itemKey')];
    var itemIDsObj = this.database.object('checklists/' + this.navParams.get('checklistKey') + '/itemIDs/');
    var itemIDKey = Object.keys(itemIDsObj).find(key => itemIDsObj[key] === this.navParams.get('itemKey'));
    this.database.object('/items/' + this.navParams.get('itemKey')).remove();
    // this.database.object('/checklists/' + this.navParams.get('checklistKey') + '/itemIDs/' + itemIDKey).remove();
    this.navCtrl.pop();
  }

  save() {
    this.database.object('items/' + this.navParams.get('itemKey'))
    .update({
      content: this.formControl.get('content').value
    });
    this.navCtrl.pop();
  }

}
