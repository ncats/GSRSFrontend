import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../base-classes/substance-form-base-filtered-list';
import { Monomer } from '@gsrs-core/substance/substance.model';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';
import { SubstanceFormMonomersService } from './substance-form-monomers.service';

@Component({
    selector: 'app-substance-form-monomers-card',
    templateUrl: './substance-form-monomers-card.component.html',
    styleUrls: ['./substance-form-monomers-card.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubstanceFormMonomersCardComponent extends SubstanceCardBaseFilteredList<Monomer>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  monomers: Array<Monomer>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormMonomersService: SubstanceFormMonomersService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    cdr: ChangeDetectorRef
  ) {
    super(gaService, cdr);
    this.analyticsEventCategory = 'substance form monomers';
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Monomers');
  }

  ngAfterViewInit() {
    const monomersSubscription = this.substanceFormMonomersService.substanceMonomers.subscribe(monomers => {
      this.monomers = monomers;
      this.cdr?.markForCheck();
    });
    this.subscriptions.push(monomersSubscription);
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addItem(): void {
    this.addMonomer();
  }

  addMonomer(): void {
    this.substanceFormMonomersService.addSubstanceMonomer();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-monomer-0`, 'center');
    });
  }

  deleteMonomer(monomer: Monomer): void {
    this.substanceFormMonomersService.deleteSubstanceMonomer(monomer);
  }
}
