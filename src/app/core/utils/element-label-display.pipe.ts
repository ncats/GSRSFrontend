import {Pipe, PipeTransform} from '@angular/core';
import { ConfigService } from '@gsrs-core/config';

@Pipe({
  name: 'elementLabel'
})
export class ElementLabelDisplayPipe implements PipeTransform {
  
  private labels: any; 
  private conf: any; 
  private confOK: boolean = false;
  constructor(
    configService: ConfigService
  ) { 
      this.conf = configService.configData.elementLabelDisplay;
      this.labels = configService.configData.elementLabelDisplay?.labels;
      if(this.conf && this.labels) {
        this.confOK = true;     
      } else {
        console.log("Warning, No configuration data for elementLabelDisplay.labels");
      }
  }
  transform(key?: string, group?: string): string {
    if(this.confOK && this.labels[group] && this.labels[group][key]) {
      return this.labels[group][key];
    } else if(key) {
      return key;
    } else {
      return "UNKOWN ELEMENT LABEL KEY/VALUE";
    }	
  }
}  
