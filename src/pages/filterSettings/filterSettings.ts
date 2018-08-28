import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { NewLabelPage } from '../newLabel/newLabel';
import { AngularFireList } from '../../../node_modules/angularfire2/database';
import { FormBuilder, FormControl, FormArray, Validators } from '../../../node_modules/@angular/forms';
import { DatabaseService } from '../../app/database.service';

@Component({
  selector: 'page-filterSettings',
  templateUrl: 'filterSettings.html'
})
export class FilterSettingsPage {
  labelsPopulated = false;
  labels;
  filters: AngularFireList<any>;
  formControl = this.formBuilder.group({
    viewAll: false,
    labels: new FormArray([])
  });
  labelsFormArray : FormArray;
  filtersObj;
  activeListSubscription;
  labelsSubscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, public databaseService: DatabaseService, public formBuilder: FormBuilder, public toastCtrl: ToastController) { 
    this.filters = databaseService.getFiltersList();
    databaseService.getFiltersObj().subscribe( filtersObj => {
      this.filtersObj = filtersObj;
      if(this.filtersObj && this.filtersObj['all']){
        this.updateIsAllGivenValue(this.filtersObj['all']);
      } else {
        this.updateIsAllGivenValue(true);
      }
      console.log('filtersobj', this.filtersObj);
    });
    this.labelsSubscription = databaseService.getLabelsObj().subscribe(data => {
      if(data) {
        console.log('label data ', data); // object of kv pairs
        this.labels = Object.entries(data).map(([key, value]) => ({key,value})); // array of objects
        if(this.labels) {
          this.activeListSubscription = databaseService.getFilterActiveListObj().subscribe( activeListObj => {
            let labelsControls = this.labels.map(c => new FormControl(false));
            if(activeListObj) {
              for(let i in labelsControls){
                let dataKey = Object.keys(data)[i];
                let isChecked = Object.keys(activeListObj).map(key => activeListObj[key]).includes(dataKey);
                if(isChecked){
                  labelsControls[i].value = true;
                }
              }
            }
            this.labelsFormArray = new FormArray(labelsControls);
            this.formControl = this.formBuilder.group({
              viewAll:  [this.getIsAllGivenControls(), Validators.compose([Validators.required])],
              labels: this.labelsFormArray
            });
            this.labelsPopulated = true;
          });
        }
      } else {
        console.log('No labels');
      }
    });
  }
  
  addNewLabel() {
    this.labelsPopulated = false;
    this.navCtrl.push(NewLabelPage);
  }

  save() {
    //todo add listener to clicks to update isAll in view
    this.labelsSubscription.unsubscribe();
    this.activeListSubscription.unsubscribe();
    const selected = this.formControl.value.labels
      .map((v, i) => v ? this.labels[i] : null)
      .filter(v => v !== null);

    console.log('Selected ', selected);
    this.databaseService.updateActiveList(selected);
    let isAll = this.formControl.get('viewAll').value;
    console.log('is all set to', isAll);
    this.databaseService.updateFilters({all: isAll});
    this.navCtrl.goToRoot({});
    const toast = this.toastCtrl.create({
      message: 'Filters applied successfully',
      duration: 3000
    });
    toast.present();
  }

  clickedAll() {
    let isAll = this.formControl.get('viewAll').value;
    this.updateIsAllGivenValue(isAll);
  }

  updateIsAllGivenValue(value : boolean) {
    this.formControl.get('viewAll').setValue(value);
    if(this.labelsFormArray) {
      for(let control of this.labelsFormArray.controls) {
        control.setValue(value);
      }
    }
  }

  getIsAllGivenControls() : boolean {
    let allSelected = true;
    for(let control of this.labelsFormArray.controls) {
      if(!control.value) {
        allSelected = false;
      }
    }
    return allSelected;
  }

  updateIsAllGivenControls(){
    this.formControl.get('viewAll').setValue(this.getIsAllGivenControls());
  }

}
