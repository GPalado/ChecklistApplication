import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewLabelPage } from '../newLabel/newLabel';
import { AngularFireDatabase, AngularFireList } from '../../../node_modules/angularfire2/database';
import { FormBuilder, FormControl, FormArray, Validators } from '../../../node_modules/@angular/forms';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFireDatabase, public formBuilder: FormBuilder) { 
    this.filters = database.list('/filters/');
    this.filtersObj = database.object('/filters/');
    this.labelsSubscription = database.object('/labels').valueChanges().subscribe(data => {
      if(data) {
        console.log('label data ', data); // object of kv pairs
        this.labels = Object.entries(data).map(([key, value]) => ({key,value})); // array of objects
        if(this.labels) {
          this.activeListSubscription = database.object('/filters/activeList').valueChanges().subscribe( activeListObj => {
            let labelsControls = this.labels.map(c => new FormControl(false));
            for(let i in labelsControls){
              let dataKey = Object.keys(data)[i];
              console.log('active list', activeListObj);
              let isChecked = Object.keys(activeListObj).map(key => activeListObj[key]).includes(dataKey);
              if(isChecked){
                labelsControls[i].value = true;
              }
            }
            let isAll: boolean = this.filtersObj['all'];
            this.labelsFormArray = new FormArray(labelsControls);
            this.formControl = this.formBuilder.group({
              viewAll:  [isAll, Validators.compose([Validators.required])],
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
    let activeList = this.database.list('/filters/activeList');
    activeList.remove();
    for(let s of selected){
      activeList.push(s.key);
    }
    let isAll = this.formControl.get('viewAll').value;
    this.filtersObj.update({
      all: isAll
    });
    // take back to home
    this.navCtrl.goToRoot({});
  }

  clickedFilter() {
    let allSelected = true;
    for(let control of this.labelsFormArray.controls) {
      if(!control.value) {
        allSelected = false;
      }
    }
    this.formControl.get('viewAll').setValue(allSelected);
    // this.filtersObj.update({
    //   all: allSelected
    // });
  }

  clickedAll() {
    let isAll = this.formControl.get('viewAll').value;
    // this.filtersObj.update({
    //   all: isAll
    // });
    // console.log('isall ', isAll);
    for(let control of this.labelsFormArray.controls) {
      control.setValue(isAll);
    }
  }

}
