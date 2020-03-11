import { Component, OnInit } from '@angular/core';
import {Monomer, SubstanceDetail} from '../../substance/substance.model';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import { UtilsService } from '../../utils/utils.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {Subject} from 'rxjs';
import {StructuralUnit} from '@gsrs-core/substance';

@Component({
  selector: 'app-substance-structural-units',
  templateUrl: './substance-structural-units.component.html',
  styleUrls: ['./substance-structural-units.component.scss']
})
export class SubstanceStructuralUnitsComponent extends SubstanceCardBaseFilteredList<StructuralUnit> implements OnInit {
  structuralUnits: Array<StructuralUnit>;
  displayedColumns: string[] = ['SRU', 'label', 'amount', 'type', 'connectivity'];
  substanceUpdated = new Subject<SubstanceDetail>();
  constructor(
    private utilsService: UtilsService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null) {
        this.structuralUnits = this.substance.polymer.structuralUnits;
        this.countUpdate.emit(this.structuralUnits.length);
        this.filtered = this.substance.polymer.structuralUnits;
        this.pageChange();

        this.searchControl.valueChanges.subscribe(value => {
          this.filterList(value, this.structuralUnits, this.analyticsEventCategory);
        }, error => {
          console.log(error);
        });
      }
    });

  }

  displayAmount(amt): string {
    return this.utilsService.displayAmount(amt);
  }

  connectivity(con): string {
    let display = JSON.stringify(con);
    display = display.replace(':', '=');
    display = display.replace('"', '');
    display = display.replace(',', ', ');

    return display;
  }

}
