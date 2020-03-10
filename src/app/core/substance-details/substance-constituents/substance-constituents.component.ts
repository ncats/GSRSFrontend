import { Component, OnInit } from '@angular/core';
import {SafeUrl} from '@angular/platform-browser';
import {UtilsService} from '@gsrs-core/utils';
import {Constituent, SubstanceAmount, SubstanceDetail} from '@gsrs-core/substance';
import {Subject} from 'rxjs';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';

@Component({
  selector: 'app-substance-constituents',
  templateUrl: './substance-constituents.component.html',
  styleUrls: ['./substance-constituents.component.scss']
})
export class SubstanceConstituentsComponent extends SubstanceCardBaseFilteredList<Constituent> implements OnInit {
  constituents: Array<Constituent>;
  substanceUpdated = new Subject<SubstanceDetail>();
  displayedColumns: string[] = ['Substance', 'Role', 'Amount'];

  constructor(
    private utilsService: UtilsService,
    public gaService: GoogleAnalyticsService

  ) { super(gaService); }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      if (substance != null && substance.specifiedSubstance != null && substance.specifiedSubstance.constituents) {
        this.constituents = substance.specifiedSubstance.constituents;
        this.filtered = this.substance.specifiedSubstance.constituents;
        this.pageChange();

        this.searchControl.valueChanges.subscribe(value => {
          this.filterList(value, this.constituents, this.analyticsEventCategory);
        }, error => {
          console.log(error);
        });
      }
      this.countUpdate.emit(this.constituents.length);
    });
  }

  public toString(amount: SubstanceAmount): string {
    return this.utilsService.displayAmount(amount);
  }
}
