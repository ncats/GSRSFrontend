import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../base-classes/substance-form-base-filtered-list';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceCode } from '@gsrs-core/substance/substance.model';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';
import { SubstanceFormCodesService } from './substance-form-codes.service';

@Component({
  selector: 'app-substance-form-codes-card',
  templateUrl: './substance-form-codes-card.component.html',
  styleUrls: ['./substance-form-codes-card.component.scss']
})
export class SubstanceFormCodesCardComponent extends SubstanceCardBaseFilteredList<SubstanceCode>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {

  codes: Array<SubstanceCode>;
  private subscriptions: Array<Subscription> = [];
  isAlternative = false;

  constructor(
    private substanceFormCodesService: SubstanceFormCodesService,
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form codes';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Codes');
  }

  ngAfterViewInit() {
    const definitionSubscription = this.substanceFormService.definition.subscribe( level => {
      if (level.definitionType && level.definitionType === 'ALTERNATIVE') {
        this.isAlternative = true;
        this.canAddItemUpdate.emit(false);
      } else {
        this.isAlternative = false;
        this.canAddItemUpdate.emit(true);
      }
    });
    this.subscriptions.push(definitionSubscription);
    const codesSubscription = this.substanceFormCodesService.substanceCodes.subscribe(codes => {
      this.codes = codes;
      this.filtered = codes;
      const searchSubscription = this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.codes, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.subscriptions.push(searchSubscription);
      this.page = 0;
      this.pageChange();
    });
    this.subscriptions.push(codesSubscription);
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addItem(): void {
    this.addCode();
  }

  addCode(): void {
    this.substanceFormCodesService.addSubstanceCode();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-code-0`, 'center');
    });
  }

  deleteCode(code: SubstanceCode): void {
    this.substanceFormCodesService.deleteSubstanceCode(code);
  }

}
