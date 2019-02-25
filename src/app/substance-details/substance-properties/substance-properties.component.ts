import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {SubstanceAmount, SubstanceProperty} from '../../substance/substance.model';
import {UtilsService} from '../../utils/utils.service';
import {SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-substance-properties',
  templateUrl: './substance-properties.component.html',
  styleUrls: ['./substance-properties.component.scss']
})
export class SubstancePropertiesComponent extends SubstanceCardBase implements OnInit {
properties: Array<SubstanceProperty>;
displayedColumns: string[] = ['name', 'property type', 'amount', 'referenced substance', 'defining', 'parameters', 'references'];
  constructor(
    private utilService: UtilsService
  ) {
    super();
  }

  ngOnInit() {
    if (this.substance != null && this.substance.properties != null) {
      this.properties = this.substance.properties;
    }
  }

  public toString(amount: SubstanceAmount) {
    let val = '';
    if (amount) {
      if ((amount.highLimit)  && (!amount.lowLimit) && (!amount.average) ) {
        val = '>' + (amount.highLimit);
      } else if ((!amount.highLimit) && (!amount.lowLimit) && (amount.average) ) {
        val = (amount.average) + '';
      } else if ((!amount.highLimit) && (amount.lowLimit)  && (!amount.average) ) {
        val = '<' + (amount.lowLimit);
      } else if ((amount.highLimit)  && (amount.lowLimit)  && (amount.average) ) {
        val = (amount.average) + '[' + (amount.lowLimit) + ' to ' + (amount.highLimit) + ']';
      } else if ((amount.highLimit)  && (!amount.lowLimit) && (amount.average) ) {
        val = (amount.average) + '[>' + (amount.highLimit) + ']';
      } else if ((!amount.highLimit) && (amount.lowLimit)  && (amount.average) ) {
        val = (amount.average) + '[<' + (amount.lowLimit) + ']';
      }
      if (amount.nonNumericValue ) {
        val += ' { ' + amount.nonNumericValue + ' }';
        val = val.trim();
      }
      if (amount.units != null) {
        val += ' (' + amount.units + ')';
        val = val.trim();
      }
      if (val.trim().length <= 0) {
        val = '<i>empty value</i>';
      }
    }


    return val;
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    // return this.utilService.getSafeStructureImgUrl(structureId, size);
    return '';
  }

}
