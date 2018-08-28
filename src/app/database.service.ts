import { AngularFireDatabase, AngularFireList } from "../../node_modules/angularfire2/database";
import { Observable } from "../../node_modules/rxjs";
import { Injectable } from "../../node_modules/@angular/core";

@Injectable()
export class DatabaseService {
    private database: AngularFireDatabase;

    constructor(private db: AngularFireDatabase) {
        this.database = db;
    }

    getFilter(filterKey: string) : Observable<any> {
        return this.database.object('/filters/' + filterKey).valueChanges();
    }

    getFiltersObj() : Observable<any> {
        return this.database.object('/filters').valueChanges();
    }

    getFiltersList() : AngularFireList<any> {
        return this.database.list('/filters');
    }

    getFilterActiveListObj() : Observable<any> {
        return this.database.object('/filters/activeList').valueChanges();
    }

    getFilterActiveListList() : AngularFireList<any> {
        return this.database.list('/filters/activeList');
    }

    addNewFilter(labelKey: string) {
        this.database.list('/filters/activeList').push(labelKey);
    }

    updateActiveList(updatedActiveList: object[]) {
        this.getFilterActiveListList().remove();
        for(let s of updatedActiveList){
            this.addNewFilter(s['key']);
        }
    }

    updateFilters(updatedFilters: object) {
        this.database.object('/filters').update(updatedFilters);
    }

    getLabel(labelKey: string) : Observable<any> {
        return this.database.object('/labels/' + labelKey).valueChanges();
    }

    getLabelsObj() : Observable<any> {
        return this.database.object('/labels').valueChanges();
    }

    getLabelsList() : AngularFireList<any> {
        return this.database.list('/labels');
    }

    getItem(itemKey: string) : Observable<any> {
        return this.database.object('/items/' + itemKey).valueChanges();
    }

    getItemsObj() : Observable<any> {
        return this.database.object('/items').valueChanges();
    }

    getItemsList() : AngularFireList<any> {
        return this.database.list('/items');
    }

    getChecklist(checklistKey: string) : Observable<any> {
        return this.database.object('/checklists/' + checklistKey).valueChanges();
    }

    getChecklistsObj() : Observable<any> {
        return this.database.object('/checklists').valueChanges();
    }

    getChecklistsList() : AngularFireList<any> {
        return this.database.list('/checklists');
    }

    getChecklistItemIDsObj(checklistKey: string) : Observable<any> {
        return this.database.object('/checklists/'+ checklistKey +'/itemIDs').valueChanges();
    }

    getChecklistItemIDsList(checklistKey: string) : AngularFireList<any> {
        return this.database.list('/checklists/'+ checklistKey +'/itemIDs');
    }

    getChecklistLabelIDsObj(checklistKey: string) : Observable<any> {
        return this.database.object('/checklists/'+ checklistKey +'/labels').valueChanges();
    }

    getChecklistLabelIDsList(checklistKey: string) : AngularFireList<any> {
        return this.database.list('/checklists/'+ checklistKey +'/labels');
    }

    getLabelChecklistIDsObj(labelKey: string) : Observable<any> {
        return this.database.object('/labels/' + labelKey + '/checklists').valueChanges();
    }

    getLabelChecklistIDsList(labelKey: string) : AngularFireList<any> {
        return this.database.list('/labels/' + labelKey + '/checklists');
    }

    updateChecklist(checklistKey: string, updatedData: object) {
        this.database.object('/checklists/' + checklistKey).update(updatedData);
    }

    updateItem(itemKey: string, updatedData: object) {
        this.database.object('/items/' + itemKey).update(updatedData);
    }

    deleteChecklist(checklistKey: string) {
        this.getChecklistLabelIDsObj(checklistKey).take(1).subscribe(labelIDsObj => {
            for(let id of Object.keys(labelIDsObj).map(key => labelIDsObj[key])){
                this.deleteLabelFromChecklist(id, checklistKey, false);
            }
        });
        this.getChecklistItemIDsObj(checklistKey).take(1).subscribe(itemIDsObj => {
            for(let id of Object.keys(itemIDsObj).map(key => itemIDsObj[key])){
                this.deleteItemFromChecklist(id, checklistKey, false);
            }
        });
        this.database.object('/checklists/' + checklistKey).remove();
    }

    deleteLabelFromChecklist(labelKey: string, checklistKey: string, deleteRef: boolean) {
        this.getLabelChecklistIDsObj(checklistKey).take(1).subscribe(labelChecklistsObj => {
            if(labelChecklistsObj) {
                let checklistIDKey = Object.keys(labelChecklistsObj).find(key => labelChecklistsObj[key] === checklistKey);
                this.database.list('/labels/' + labelKey + '/checklists/' + checklistIDKey).remove();
                if(deleteRef){
                    this.database.list('/checklists/' + checklistKey + '/labels/'+ labelKey).remove();
                }
            }
          });
    }

    deleteItemFromChecklist(itemKey: string, checklistKey: string, deleteRef: boolean) {
        this.getChecklistItemIDsObj(checklistKey).take(1).subscribe(itemIDs => {
            if(itemIDs) {
                let refKey = Object.keys(itemIDs).find(key => itemIDs[key] === itemKey);
                this.database.list('/items/' + itemKey).remove();
                if(deleteRef) {
                    this.database.list('/checklists/' + checklistKey + '/itemIDs/' + refKey).remove();
                }
            }
        });
    }

    addLabelToChecklist(labelKey: string, checklistKey: string){
        this.database.list('/labels/' + labelKey + '/checklists').push(checklistKey);
        this.database.list('/checklists/' + checklistKey + '/labels/').push(labelKey);
    }

    updateChecklistWithLabels(checklistKey: string, labels: any) {
        console.log('Labels update ', labels); // labels is array of objects with {key: labelKey} as values
        let toRemove: any[] = [];
        let toAdd = [];
        let checklistLabels : AngularFireList<any> = this.getChecklistLabelIDsList(checklistKey);
        this.getChecklistLabelIDsObj(checklistKey).take(1).subscribe(checklistLabelsObjs => {
          if(labels){
            toAdd = Object.keys(labels).map(key => labels[key]); // array of keys to add
            let existingLabelkey;
            for(existingLabelkey in checklistLabelsObjs) {
              if(!Object.keys(labels).map(key => labels[key]).includes(checklistLabelsObjs[existingLabelkey])){ // label needs to be removed from existing labels
                toRemove.push(checklistLabelsObjs[existingLabelkey]);
              } else { // label already exists, doesn't need to be readded
                let id = toAdd.indexOf(checklistLabelsObjs[existingLabelkey]);
                toAdd.splice(id, 1);
              }
            }
          } else { // no labels selected - clear labels
            console.log('No labels selected');
            toRemove = Object.keys(checklistLabelsObjs);
            checklistLabels.remove();
          }
          console.log('To Remove ', toRemove);
          console.log('To Add ', toAdd);
          toRemove.forEach(remove => { //remove is key of label id in checklist
            this.deleteLabelFromChecklist(remove, checklistKey, true);
          });
          toAdd.forEach(add => {
            this.addLabelToChecklist(add, checklistKey);
          });
        });
      }
}