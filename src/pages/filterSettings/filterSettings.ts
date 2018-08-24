import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewLabelPage } from '../newLabel/newLabel';
import { AngularFireDatabase, AngularFireList } from '../../../node_modules/angularfire2/database';
import { FormBuilder, FormControl, FormArray } from '../../../node_modules/@angular/forms';

@Component({
  selector: 'page-filterSettings',
  templateUrl: 'filterSettings.html'
})
export class FilterSettingsPage {
  labels;
  filters: AngularFireList<any>;
  formControl = this.formBuilder.group({
    viewAll: false,
    labels: new FormArray([])
  });
  filtersObj;

  constructor(public navCtrl: NavController, public navParams: NavParams, public database: AngularFireDatabase, public formBuilder: FormBuilder) { 
    this.filters = database.list('/filters/');
    this.filtersObj = this.database.object('/filters/');
    database.object('/labels').valueChanges().subscribe(data => {
      if(data) {
        console.log('label data ', data); // object of kv pairs
        this.labels = Object.entries(data).map(([key, value]) => ({key,value})); // array of objects
        if(this.labels) {
          const controls = this.labels.map(c => new FormControl(false));
          for(let i in controls){
            let dataKey = Object.keys(data)[i];
            let isChecked: Boolean = data[dataKey]['checked'];
            if(isChecked){
              controls[i].value = true;
            }
          }
          let isAll: boolean = this.filtersObj['all'];
          this.formControl = this.formBuilder.group({
            viewAll: isAll,
            labels: new FormArray(controls)
          });
        }
      } else {
        console.log('No labels');
      }
    });
  }
  
  addNewLabel() {
    this.navCtrl.push(NewLabelPage);
  }

  save() {
    const selected = this.formControl.value.labels
      .map((v, i) => v ? this.labels[i] : null)
      .filter(v => v !== null);

    console.log('Selected ', selected);
    // take back to home
    this.navCtrl.goToRoot({});
  }

  allChanged() {
    let isAll = this.formControl.get('viewAll').value;
    this.filtersObj.update({
      all: isAll
    });
    for(let i in this.formControl.value.labels) {
      if(isAll) {
       this.formControl.value.labels[i].disable();
      } else {
        this.formControl.value.labels[i].enable();
      }
    }
  }

}
