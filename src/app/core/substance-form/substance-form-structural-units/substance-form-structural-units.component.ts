import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';
import {StructuralUnit, SubstanceCode} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';

@Component({
  selector: 'app-substance-form-structural-units',
  templateUrl: './substance-form-structural-units.component.html',
  styleUrls: ['./substance-form-structural-units.component.scss']
})
export class SubstanceFormStructuralUnitsComponent extends SubstanceCardBaseFilteredList<StructuralUnit> implements OnInit, AfterViewInit, OnDestroy {
  structuralUnits: Array<StructuralUnit>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form structural units';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Structural Units');
  }

  ngAfterViewInit() {
    const structuralSubscription = this.substanceFormService.substanceSRUs.subscribe(structuralUnits => {
      this.structuralUnits = structuralUnits;
    });
    this.subscriptions.push(structuralSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  deleteSRU(unit: StructuralUnit): void {
    this.substanceFormService.deleteSubstanceSRU(unit);
  }
}
