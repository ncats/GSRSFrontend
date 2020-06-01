import { Injectable } from '@angular/core';
import {DataDictionary} from '@gsrs-core/utils/data-dictionary';


@Injectable({
  providedIn: 'root'
})
export class DataDictionaryService {
  private dataDictionary: any = DataDictionary;
  constructor() { }



  getDictionaryRow(key: string): any {
    return this.dataDictionary[key];
  }

  getDictionaryField(key: string, field: string): string {
    return this.dataDictionary[key][field];
  }

  getRowByProperty(type: string, value: string): any {
    this.dataDictionary.forEach();
  }

  getCVDomainRows(): any {
    const newObj = [];
    Object.keys(this.dataDictionary).forEach(key => {
      const cv = this.dataDictionary[key]['CVDomain'];
      if (cv !== '') {
        if (newObj[cv] && newObj[cv].length > 0) {
          newObj[cv].push(key);
      } else {
        newObj[cv] = [key];

      }
    }
    });
    return newObj;
  }
}
