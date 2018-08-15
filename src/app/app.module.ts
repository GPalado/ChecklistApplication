import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { DisplaySettingsPage } from '../pages/displaySettings/displaySettings';
import { FilterSettingsPage } from '../pages/filterSettings/filterSettings';
import { PipesModule } from '../pipes/pipes.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NewChecklistPage } from '../pages/newChecklist/newChecklist';
import { ChecklistPage } from '../pages/checklist/checklist';
import { EditChecklistPage } from '../pages/editChecklist/editChecklist';
import { ItemPage } from '../pages/item/item';
import { NewItemPage } from '../pages/newItem/newItem';
import { FormsModule } from '@angular/forms';
import { NewLabelPage } from '../pages/newLabel/newLabel';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

export const firebaseConfig = {
  apiKey: "AIzaSyCF6-lsSi-f099PFBUeSwajRbrU667qE7M",
  authDomain: "checklist-app-325.firebaseapp.com",
  databaseURL: "https://checklist-app-325.firebaseio.com",
  projectId: "checklist-app-325",
  storageBucket: "checklist-app-325.appspot.com",
  messagingSenderId: "133197319543"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettingsPage,
    DisplaySettingsPage,
    FilterSettingsPage,
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
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingsPage,
    DisplaySettingsPage,
    FilterSettingsPage,
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
