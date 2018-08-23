import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModifyChecklistPage } from './modifyChecklist';

@NgModule({
  declarations: [
    ModifyChecklistPage,
  ],
  imports: [
    IonicPageModule.forChild(ModifyChecklistPage),
  ],
})
export class ModifyChecklistPageModule {}
