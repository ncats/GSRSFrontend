import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {SubstanceAmount, SubstanceDetail, SubstanceProperty} from '../../substance/substance.model';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-substance-properties',
  templateUrl: './substance-properties.component.html',
  styleUrls: ['./substance-properties.component.scss']
})
export class SubstancePropertiesComponent extends SubstanceCardBase implements OnInit {
  properties: Array<SubstanceProperty> = [];
  displayedColumns: string[] = ['name', 'property type', 'amount', 'referenced substance', 'defining', 'parameters', 'references'];
  substanceUpdated = new Subject<SubstanceDetail>();
  constructor(
  ) {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null && this.substance.properties != null) {
        this.properties = this.substance.properties;
      }
      this.countUpdate.emit(this.properties.length);
    });
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
        val = '(empty value)';
      }
    }


    return val;
  }

}
