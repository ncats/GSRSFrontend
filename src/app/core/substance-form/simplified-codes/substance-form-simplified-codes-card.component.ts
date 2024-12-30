import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../base-classes/substance-form-base-filtered-list';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceCode } from '@gsrs-core/substance/substance.model';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import {combineLatest, first, Subscription} from 'rxjs';
import { SubstanceFormCodesService } from '../codes/substance-form-codes.service';

@Component({
  selector: 'app-simplified-substance-form-codes-card',
  templateUrl: './substance-form-simplified-codes-card.component.html',
  styleUrls: ['./substance-form-simplified-codes-card.component.scss']
})
export class SubstanceFormSimplifiedCodesCardComponent extends SubstanceCardBaseFilteredList<SubstanceCode>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {

  codes: Array<SubstanceCode>;
  private subscriptions: Array<Subscription> = [];
  pageSize = 10;
  expanded = true;
  validate = false;

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

  collapse() {
    this.expanded = !this.expanded;
  }

  ngAfterViewInit() {
    const definitionSubscription = this.substanceFormService.definition.subscribe( level => {
      if (level.definitionType && level.definitionType === 'ALTERNATIVE') {
      //  this.canAddItemUpdate.emit(false);
        this.hiddenStateUpdate.emit(true);
      } else {
        this.canAddItemUpdate.emit(true);
        this.hiddenStateUpdate.emit(false);
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

    // Init default.
    const defaultSubscription = combineLatest([this.substanceFormService.simplifiedForm, this.substanceFormCodesService.substanceCodes.pipe(first())]).subscribe({
      next: ([simplified, codes]) => {
        if (simplified && codes.length == 0){
          this.addDefaultSubstanceCode()
        }
      },
      error: error => {
        console.error(error);
      }
    });
    this.subscriptions.push(defaultSubscription)
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

  addDefaultSubstanceCode(): void {
    this.substanceFormCodesService.addSubstanceCode({
      codeSystem: "CAS",
      access:["protected"]
    });
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
