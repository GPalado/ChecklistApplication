import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { NewChecklistPage } from '../newChecklist/newChecklist';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from '../../../node_modules/rxjs';
import { ChecklistPage } from '../checklist/checklist';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  checklists: Observable<any>;

  constructor(public navCtrl: NavController, public database: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    this.checklists = this.database.object('/checklists').valueChanges();
  }

  goToSettings() {
    this.navCtrl.push(SettingsPage);
  }

  addNewChecklist() {
    this.navCtrl.push(NewChecklistPage);
  }

  goToChecklist(checklistKey) {
    this.navCtrl.push(ChecklistPage, {
      key: checklistKey
    });
  }
}
