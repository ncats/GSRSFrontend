import { Injectable } from '@angular/core';
import {DataDictionary} from "@gsrs-core/utils/data-dictionary";


@Injectable({
  providedIn: 'root'
})
export class DataDictionaryService {
  private dataDictionary: any = DataDictionary;
  constructor() { }



  getDictionaryRow(key: string): any{
    return this.dataDictionary[key];
  }

  getDictionaryField(key:string, field: string): string {
    return this.dataDictionary[key][field];
  }
}
