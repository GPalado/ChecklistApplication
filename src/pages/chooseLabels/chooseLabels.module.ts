import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChooseLabelsPage } from './chooseLabels';

@NgModule({
  declarations: [
    ChooseLabelsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChooseLabelsPage),
  ],
})
export class ChooseLabelsPageModule {}
