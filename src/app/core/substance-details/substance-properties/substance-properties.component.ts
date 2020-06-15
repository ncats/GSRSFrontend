import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {SubstanceAmount, SubstanceDetail, SubstanceProperty} from '../../substance/substance.model';
import {Subject} from 'rxjs';
import { UtilsService } from '@gsrs-core/utils';

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
    private utilsService: UtilsService
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
    return this.utilsService.displayAmount(amount);
  }

}
