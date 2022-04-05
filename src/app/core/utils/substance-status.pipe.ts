import {Pipe, PipeTransform} from '@angular/core';
import { ConfigService } from '@gsrs-core/config';

@Pipe({
  name: 'statusDisplay'
})
export class SubstanceStatusPipe implements PipeTransform {
    constructor(public configService: ConfigService) {

    }
  transform(name: string, item2?: string): string {

   if(name === 'approved') {
       if(this.configService.configData && this.configService.configData.approvalCodeName) {
           return 'Validated (' + this.configService.configData.approvalCodeName + ')';
       } else {
           return 'Validated (UNII)';
       }
   } else {
       return name;
   }

  }
}