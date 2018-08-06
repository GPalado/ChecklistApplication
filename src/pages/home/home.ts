import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { NewChecklistPage } from '../newChecklist/newChecklist';
import { ChecklistPage } from '../checklist/checklist';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  goToSettings() {
    this.navCtrl.push(SettingsPage);
  }

  goToNewChecklist() {
    this.navCtrl.push(NewChecklistPage);
  }

  goToChecklist() {
    this.navCtrl.push(ChecklistPage);
  }

}
