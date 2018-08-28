import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { AngularFireList } from 'angularfire2/database';
import { ChecklistPage } from '../checklist/checklist';
import { FilterSettingsPage } from '../filterSettings/filterSettings';
import { FormControl } from '../../../node_modules/@angular/forms';
import { ModifyChecklistPage } from '../modifyChecklist/modifyChecklist';
import { DatabaseService } from '../../app/database.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  checklists;
  labelNames;
  labelData;
  filterData;

  constructor(public navCtrl: NavController, public databaseService: DatabaseService, public toastCtrl: ToastController) {
    databaseService.getLabelsObj().subscribe( labelData => {
      console.log('labels update', labelData);
      if(labelData){
        this.labelData = labelData;
        this.labelNames = {};
        Object.keys(labelData).forEach(labelKey =>{
          this.labelNames[labelKey] = labelData[labelKey];
        });
      }
    });
    databaseService.getFiltersObj().subscribe(filterData => {
      this.filterData = filterData;
      console.log('filters update', filterData);
    });
    databaseService.getChecklistsObj().subscribe(checklistData => {
      console.log('checklists update', checklistData);
      this.checklists = {};
      this.updateFilters(checklistData);
    });    
  }

  updateFilters(checklistData) {
    if(this.filterData) {
        if(this.filterData['all']){
          this.getChecklists(checklistData, [], true);
        } else {
          this.getChecklists(checklistData, this.getChecklistIDs(), false);
        }
      } else {
        this.getChecklists(checklistData, [], true);
      }
  }

  getChecklistIDs(): String[]{
    let validChecklistIDs = [];
    let activeList = this.filterData['activeList'];
    if(this.labelData && activeList){
      for(let activeListKey of Object.keys(activeList)){
        let labelID = activeList[activeListKey];
        if(this.labelData[labelID]['checklists']) {
          let checklistKeys = Object.keys(this.labelData[labelID]['checklists']).map(key => this.labelData[labelID]['checklists'][key]);
          for(let key of checklistKeys){
            if(!validChecklistIDs.includes(key)) {
              validChecklistIDs.push(key);
            }
          }
        }
      }
    }
    return validChecklistIDs;
  }

  getChecklists(checklistData, keys : String[], all : boolean){
    if(checklistData) {
      for(let checklistKey of Object.keys(checklistData)){
        if(all || keys.includes(checklistKey)) {
          this.checklists[checklistKey] = checklistData[checklistKey];
        }
      }
      console.log('checklists', this.checklists);
    }
  }

  public getLabelFor(key) : string {
    return this.labelNames[key]['name'];
  }

  goToFilterSettings() {
    this.navCtrl.push(FilterSettingsPage);
  }

  addNewChecklist() {
    var submit = (formControl: FormControl, cls: AngularFireList<any>, labels: any) => {
      var descrip = formControl.get('description').value;
      if(!descrip){
        descrip="";
      }
      const newChecklistRef = cls.push({
        name: formControl.get('name').value,
        description: descrip
      });
      if(labels){
        var checklistLabels : AngularFireList<any> = this.databaseService.getChecklistLabelIDsList(newChecklistRef.key);
        var key;
        for(key in Object.keys(labels)) {
          checklistLabels.push(labels[key]);
          var labelChecklists : AngularFireList<any> = this.databaseService.getLabelChecklistIDsList(labels[key]);
          labelChecklists.push(newChecklistRef.key);
        }
      }
      console.log('Save checklist ', newChecklistRef);
      const toast = this.toastCtrl.create({
        message: 'Checklist saved successfully',
        duration: 3000
      });
      toast.present();
    }
    
    this.navCtrl.push(ModifyChecklistPage, {
      pageName: 'New Checklist',
      submit: (formControl, labels) => submit(formControl, this.databaseService.getChecklistsList(), labels)
    });
  }

  goToChecklist(checklistKey) {
    this.navCtrl.push(ChecklistPage, {
      key: checklistKey
    });
  }
}
