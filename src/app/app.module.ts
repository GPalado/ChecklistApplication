import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { FilterSettingsPage } from '../pages/filterSettings/filterSettings';
import { PipesModule } from '../pipes/pipes.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ChecklistPage } from '../pages/checklist/checklist';
import { NewItemPage } from '../pages/newItem/newItem';
import { FormsModule } from '@angular/forms';
import { NewLabelPage } from '../pages/newLabel/newLabel';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { ColorPickerModule } from 'ngx-color-picker';
import { ChooseLabelsPage } from '../pages/chooseLabels/chooseLabels';
import { ModifyChecklistPage } from '../pages/modifyChecklist/modifyChecklist';

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
    FilterSettingsPage,
    ChecklistPage,
    NewItemPage,
    NewLabelPage,
    ChooseLabelsPage,
    ModifyChecklistPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    PipesModule,
    ColorPickerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingsPage,
    FilterSettingsPage,
    ChecklistPage,
    NewItemPage,
    NewLabelPage,
    ChooseLabelsPage,
    ModifyChecklistPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
