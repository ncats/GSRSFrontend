import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '../substance-form-base-filtered-list';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceCode } from '@gsrs-core/substance/substance.model';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-substance-form-monomers',
  templateUrl: './substance-form-monomers.component.html',
  styleUrls: ['./substance-form-monomers.component.scss']
})
export class SubstanceFormMonomersComponent extends SubstanceCardBaseFilteredList<SubstanceCode> implements OnInit, AfterViewInit, OnDestroy {
  monomers: Array<SubstanceCode>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form monomers';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Monomers');
  }

  ngAfterViewInit() {
    const monomersSubscription = this.substanceFormService.substanceMonomers.subscribe(monomers => {
      this.monomers = monomers;
    });
    this.subscriptions.push(monomersSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addCode(): void {
    this.substanceFormService.addSubstanceMonomer();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-monomer-0`, 'center');
    });
  }

  deleteCode(code: SubstanceCode): void {
    this.substanceFormService.deleteSubstanceMonomer(code);
  }

}
