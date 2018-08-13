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
  itemIDs: any;

  formControl = this.formBuilder.group({
    content: ['', Validators.compose([Validators.maxLength(this.maxChars), Validators.required])]
  });

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFireDatabase, public formBuilder: FormBuilder) { 
    var clPath = '/checklists/' + this.navParams.get('checklistKey') + '/itemIDs';
    console.log('Path ' + clPath);
    database.object(clPath).valueChanges().subscribe(data => {
      this.itemIDs = data;
      console.log('ItemIDs ' + data);
    });
    var itemPath = '/items/' + navParams.get('itemKey');
    database.object(itemPath).valueChanges().take(1).subscribe(data => {
      this.formControl.controls['content'].setValue(data['content']);
    });
  }

  deleteItem() {
    // todo alert for check make sure eetc things
    var itemIDKey = Object.keys(this.itemIDs).find(key => this.itemIDs[key] === this.navParams.get('itemKey'));
    console.log('ItemIDKey: ' + itemIDKey);
    this.database.object('/items/' + this.navParams.get('itemKey')).remove(); // remove item
    this.database.object('/checklists/' + this.navParams.get('checklistKey') + '/itemIDs/' + itemIDKey).remove(); // remove item reference
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
