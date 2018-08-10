import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyValue',
})
export class KeyValuePipe implements PipeTransform {
  transform(value: object) {
    if(value == null){
      console.log("null value");
      return null;
    }
    return Object.entries(value).map(([key, value]) => ({key,value}));
  }
}