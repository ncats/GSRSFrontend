import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../base-classes/substance-form-base-filtered-list';
import { SubstanceName } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-substance-form-names',
  templateUrl: './substance-form-names.component.html',
  styleUrls: ['./substance-form-names.component.scss']
})
export class SubstanceFormNamesComponent
  extends SubstanceCardBaseFilteredList<SubstanceName>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  names: Array<SubstanceName>;
  private subscriptions: Array<Subscription> = [];
  isAlternative = false;

  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form names';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Names');
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
    const namesSubscription = this.substanceFormService.substanceNames.subscribe(names => {
      this.names = names;
      this.filtered = names;
      const searchSubscription = this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.names, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.subscriptions.push(searchSubscription);
      this.page = 0;
      this.pageChange();
    });
    this.subscriptions.push(namesSubscription);
  }

  standardize(): void {
    this.substanceFormService.standardizeNames();
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addItem(): void {
    this.addName();
  }

  addName(): void {
    this.substanceFormService.addSubstanceName();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-name-0`, 'center');
    });
  }

  priorityUpdated(updatedName: SubstanceName): void {
    this.names.forEach(name => {
      if (name !== updatedName) {
        name.displayName = false;
      }
    });
  }

  deleteName(name: SubstanceName): void {
    this.substanceFormService.deleteSubstanceName(name);
  }

}
