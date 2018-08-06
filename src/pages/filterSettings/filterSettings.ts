import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewLabelPage } from '../newLabel/newLabel';

@Component({
  selector: 'page-filterSettings',
  templateUrl: 'filterSettings.html'
})
export class FilterSettingsPage {
  filter = {}

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    // todo filters in the database
  }
  
  addNewLabel() {
    this.navCtrl.push(NewLabelPage);
  }

  updateFilters() {
    this.navCtrl.pop();
  }

  updateAll() {
    // todo either activate or deactivate all other filters
  }

}
