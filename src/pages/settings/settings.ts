import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Page } from 'ionic-angular/umd/navigation/nav-util';
import { DisplaySettingsPage } from '../displaySettings/displaySettings';
import { NotificationSettingsPage } from '../notificationSettings/notificationSettings';
import { FilterSettingsPage } from '../filterSettings/filterSettings';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string, page: Page}>;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.icons = ["color-palette", "notifications", "checkbox-outline"];
    var titles = ["Display", "Notifications", "Filters"];
    var notes = ["Layout, themes, font size", "Activated status, delay", "Choose labels to display"];
    var pages = [DisplaySettingsPage, NotificationSettingsPage, FilterSettingsPage];
    this.items = [];
    for (let i = 0; i < this.icons.length; i++) {
      this.items.push({
        title: titles[i],
        note: notes[i],
        icon: this.icons[i],
        page: pages[i]
      });
    }
  }

  itemTapped(event, item) {
    this.navCtrl.push(item.page);
  }
}
