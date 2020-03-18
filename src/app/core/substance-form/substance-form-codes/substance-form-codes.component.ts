import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../substance-form-base-filtered-list';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceCode } from '@gsrs-core/substance/substance.model';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-substance-form-codes',
  templateUrl: './substance-form-codes.component.html',
  styleUrls: ['./substance-form-codes.component.scss']
})
export class SubstanceFormCodesComponent extends SubstanceCardBaseFilteredList<SubstanceCode>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {

  codes: Array<SubstanceCode>;
  private subscriptions: Array<Subscription> = [];
  isAlternative = false;

  constructor(
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
    const codesSubscription = this.substanceFormService.substanceCodes.subscribe(codes => {
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
    this.substanceFormService.addSubstanceCode();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-code-0`, 'center');
    });
  }

  deleteCode(code: SubstanceCode): void {
    this.substanceFormService.deleteSubstanceCode(code);
  }

}
