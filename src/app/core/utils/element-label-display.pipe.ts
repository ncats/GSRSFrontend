import {Pipe, PipeTransform} from '@angular/core';
import { ConfigService } from '@gsrs-core/config';

@Pipe({
  name: 'elementLabel'
})
export class ElementLabelDisplayPipe implements PipeTransform {
  
  private labels: any; 

  constructor(
    configService: ConfigService
  ) { 
      this.labels = configService.configData.elementLabelDisplay.labels;
  }

  transform(key: string, group: string): string {

    if(this.labels[group] && this.labels[group][key]) {
        return this.labels[group][key] + " PIPED";
      } else if(key) {
        return key;
      } else {
        return "UNKNOWN ELEMENT LABEL";
      }	
  }  
}