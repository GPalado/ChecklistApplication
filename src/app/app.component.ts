import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { DisplaySettingsPage } from '../pages/displaySettings/displaySettings';
import { FilterSettingsPage } from '../pages/filterSettings/filterSettings';
import { NewChecklistPage } from '../pages/newChecklist/newChecklist';
import { ChecklistPage } from '../pages/checklist/checklist';
import { EditChecklistPage } from '../pages/editChecklist/editChecklist';
import { ItemPage } from '../pages/item/item';
import { NewItemPage } from '../pages/newItem/newItem';
import { NewLabelPage } from '../pages/newLabel/newLabel';
import { ChooseLabelsPage } from '../pages/chooseLabels/chooseLabels';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Settings', component: SettingsPage },
      { title: 'Display Settings', component: DisplaySettingsPage },
      { title: 'Filter Settings', component: FilterSettingsPage },
      { title: 'New Checklist', component: NewChecklistPage },
      { title: 'Checklist', component: ChecklistPage },
      { title: 'Edit Checklist', component: EditChecklistPage },
      { title: 'Item', component: ItemPage },
      { title: 'Choose Labels', component: ChooseLabelsPage },
      { title: 'New Item', component: NewItemPage },
      { title: 'New Label', component: NewLabelPage}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
