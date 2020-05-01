import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../base-classes/substance-form-base-filtered-list';
import { SubstanceProperty } from '@gsrs-core/substance/substance.model';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';
import { SubstanceFormPropertiesService } from './substance-form-properties.service';

@Component({
  selector: 'app-substance-form-properties-card',
  templateUrl: './substance-form-properties-card.component.html',
  styleUrls: ['./substance-form-properties-card.component.scss']
})
export class SubstanceFormPropertiesCardComponent extends SubstanceCardBaseFilteredList<SubstanceProperty>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  properties: Array<SubstanceProperty>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormPropertiesService: SubstanceFormPropertiesService,
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
    const propertiesSubscription = this.substanceFormPropertiesService.substanceProperties.subscribe(properties => {
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
    this.substanceFormPropertiesService.addSubstanceProperty();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-property-0`, 'center');
    });
  }

  deleteProperty(property: SubstanceProperty): void {
    this.substanceFormPropertiesService.deleteSubstanceProperty(property);
  }

}
