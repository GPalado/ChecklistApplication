import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { DisplaySettingsPage } from '../pages/displaySettings/displaySettings';
import { FilterSettingsPage } from '../pages/filterSettings/filterSettings';
import { NotificationSettingsPage } from '../pages/notificationSettings/notificationSettings';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NewChecklistPage } from '../pages/newChecklist/newChecklist';
import { ChecklistPage } from '../pages/checklist/checklist';
import { EditChecklistPage } from '../pages/editChecklist/editChecklist';
import { ItemPage } from '../pages/item/item';
import { NewItemPage } from '../pages/newItem/newItem';
import { FormsModule } from '@angular/forms';
import { NewLabelPage } from '../pages/newLabel/newLabel';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettingsPage,
    DisplaySettingsPage,
    FilterSettingsPage,
    NotificationSettingsPage,
    NewChecklistPage,
    ChecklistPage,
    EditChecklistPage,
    ItemPage,
    NewItemPage,
    NewLabelPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingsPage,
    DisplaySettingsPage,
    FilterSettingsPage,
    NotificationSettingsPage,
    NewChecklistPage,
    ChecklistPage,
    EditChecklistPage,
    ItemPage,
    NewItemPage,
    NewLabelPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
