import {Pipe, PipeTransform} from '@angular/core';
import { ConfigService } from '@gsrs-core/config';

@Pipe({
  name: 'elementLabel'
})
export class ElementLabelDisplayPipe implements PipeTransform {

  private labels: any; 
  private defaultLabels: any;
  private conf: any; 
  // labels.group.key.value
  private defaultConf =
  {"elementLabelDisplay": {
      "labels": {
        "substance_names_name": {
            "displayNameTitle": "Display Name",
            "displayNameShortTitle":"DN",
            "preferredTitle": "Additional Listing Name",
            "preferredShortTitle": "AL"
        }
      }
    }
  };

  private confOK: boolean = false;
  constructor(
    configService: ConfigService
  ) { 
      this.conf = configService.configData.elementLabelDisplay;
      this.labels = configService.configData.elementLabelDisplay?.labels;
      this.defaultLabels = this.defaultConf.elementLabelDisplay.labels;
      if(this.conf && this.labels) {
        this.confOK = true;     
      }  
  }
  transform(key?: string, group?: string): string {
    if(this.confOK && this.labels[group] && this.labels[group][key]) {
      return this.labels[group][key];
    } else if(this.defaultLabels && this.defaultLabels[group] && this.defaultLabels[group][key]) { 
      return this.defaultLabels[group][key];
    } else if(key) {
      return key;
    } else {
      return "UNKOWN ELEMENT LABEL KEY/VALUE";
    }	
  }
}

