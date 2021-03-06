import { Component, OnInit } from '@angular/core';
import {Monomer, SubstanceDetail} from '../../substance/substance.model';
import { SafeUrl } from '@angular/platform-browser';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import { UtilsService } from '../../utils/utils.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-substance-monomers',
  templateUrl: './substance-monomers.component.html',
  styleUrls: ['./substance-monomers.component.scss']
})
export class SubstanceMonomersComponent extends SubstanceCardBaseFilteredList<Monomer> implements OnInit {
  monomers: Array<Monomer>;
  displayedColumns: string[] = ['material', 'amount', 'type', 'defining'];
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
        this.monomers = this.substance.polymer.monomers;
        this.countUpdate.emit(this.monomers.length);
        this.filtered = this.substance.polymer.monomers;
        this.pageChange();

        this.searchControl.valueChanges.subscribe(value => {
          this.filterList(value, this.monomers, this.analyticsEventCategory);
        }, error => {
          console.log(error);
        });
      }
    });

  }

  displayAmount(amt): string {
    return this.utilsService.displayAmount(amt);
  }

}
