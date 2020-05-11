import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/base-classes/substance-form-base-filtered-list';
import {StructuralUnit} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import { SubstanceFormStructuralUnitsService } from './substance-form-structural-units.service';

@Component({
  selector: 'app-substance-form-structural-units-card',
  templateUrl: './substance-form-structural-units-card.component.html',
  styleUrls: ['./substance-form-structural-units-card.component.scss']
})
export class SubstanceFormStructuralUnitsCardComponent extends SubstanceCardBaseFilteredList<StructuralUnit>
  implements OnInit, AfterViewInit, OnDestroy {
  structuralUnits: Array<StructuralUnit>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormStructuralUnitsService: SubstanceFormStructuralUnitsService,
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
    const structuralSubscription = this.substanceFormStructuralUnitsService.substanceSRUs.subscribe(structuralUnits => {
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
    this.substanceFormStructuralUnitsService.deleteSubstanceSRU(unit);
  }
}
