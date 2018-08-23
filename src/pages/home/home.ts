import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from '../../../node_modules/rxjs';
import { ChecklistPage } from '../checklist/checklist';
import { FormControl } from '../../../node_modules/@angular/forms';
import { ModifyChecklistPage } from '../modifyChecklist/modifyChecklist';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  checklists: Observable<any>;

  constructor(public navCtrl: NavController, public database: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    this.checklists = this.database.object('/checklists').valueChanges();
  }

  goToSettings() {
    this.navCtrl.push(SettingsPage);
  }

  addNewChecklist() {
    var submit = (formControl: FormControl, cls: AngularFireList<any>, labels: any) => {
      var descrip = formControl.get('description').value;
      if(descrip===undefined){
        descrip="";
      }
      const newChecklistRef = cls.push({
        name: formControl.get('name').value,
        description: descrip
      });
      if(labels !== null && labels !== undefined){
        var checklistLabels : AngularFireList<any> = this.database.list('/checklists/' + newChecklistRef.key + '/labels');
        var key;
        for(key in Object.keys(labels)) {
          checklistLabels.push(labels[key].key);
          var labelChecklists : AngularFireList<any> = this.database.list('/labels/' + labels[key].key + '/checklists');
          labelChecklists.push(newChecklistRef.key);
        }
      }
      console.log('Save checklist ', newChecklistRef);
    }
    
    this.navCtrl.push(ModifyChecklistPage, {
      pageName: 'New Checklist',
      submit: (formControl, labels) => submit(formControl, this.database.list('/checklists'), labels)
    });
  }

  goToChecklist(checklistKey) {
    this.navCtrl.push(ChecklistPage, {
      key: checklistKey
    });
  }
}
