import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-displaySettings',
  templateUrl: 'displaySettings.html'
})
export class DisplaySettingsPage {
  currentTheme : string;
  themeOptions: string[] = ['default', 'dark']
  // capitalization?

  constructor(public navCtrl: NavController, public navParams: NavParams) { 
    // var defaultThemeRef = firebase.database().ref('settings/theme');
    // defaultThemeRef.on('value', function(snapshot) {
    //   this.defaultTheme = snapshot.val();
    // });
  }  

  themeChange() {
    
  }
}
