import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// import { PopoverController } from 'ionic-angular';

@Component({
  selector: 'page-notificationSettings',
  templateUrl: 'notificationSettings.html'
})
export class NotificationSettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams/*, public popoverCtrl: PopoverController*/) { 
  }
  
  activeChange() {

  }

  // presentPopover(event) {
  //   let popover = this.popoverCtrl.create(PopoverPage);
  //   popover.present({
  //     ev: event
  //   });
  // }

}
