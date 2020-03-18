import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../substance-form-base-filtered-list';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceProperty } from '@gsrs-core/substance/substance.model';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-substance-form-properties',
  templateUrl: './substance-form-properties.component.html',
  styleUrls: ['./substance-form-properties.component.scss']
})
export class SubstanceFormPropertiesComponent extends SubstanceCardBaseFilteredList<SubstanceProperty>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  properties: Array<SubstanceProperty>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form properties';
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Properties');
  }

  ngAfterViewInit() {
    const propertiesSubscription = this.substanceFormService.substanceProperties.subscribe(properties => {
      this.properties = properties;
      this.filtered = properties;
      const searchSubscription = this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.properties, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.subscriptions.push(searchSubscription);
      this.page = 0;
      this.pageChange();
    });
    this.subscriptions.push(propertiesSubscription);
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addItem(): void {
    this.addProperty();
  }

  addProperty(): void {
    this.substanceFormService.addSubstanceProperty();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-property-0`, 'center');
    });
  }

  deleteProperty(property: SubstanceProperty): void {
    this.substanceFormService.deleteSubstanceProperty(property);
  }

}
