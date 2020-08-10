import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../base-classes/substance-form-base-filtered-list';
import { SubstanceRelationship } from '@gsrs-core/substance/substance.model';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';
import { SubstanceFormRelationshipsService } from './substance-form-relationships.service';

@Component({
  selector: 'app-substance-form-relationships-card',
  templateUrl: './substance-form-relationships-card.component.html',
  styleUrls: ['./substance-form-relationships-card.component.scss']
})
export class SubstanceFormRelationshipsCardComponent extends SubstanceCardBaseFilteredList<SubstanceRelationship>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  relationships: Array<SubstanceRelationship>;
  private subscriptions: Array<Subscription> = [];
  expanded = true;

  constructor(
    private substanceFormRelationshipsService: SubstanceFormRelationshipsService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Relationships');
    this.analyticsEventCategory = 'substance form relationships';
  }

  ngAfterViewInit() {
    const relationshipsSubscription = this.substanceFormRelationshipsService.substanceRelationships.subscribe(relationships => {
      this.relationships = relationships;
      this.filtered = relationships;
      const searchSubscription = this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.relationships, this.analyticsEventCategory);
      }, error => {
      });
      this.subscriptions.push(searchSubscription);
      this.page = 0;
      this.pageChange();
    });
    this.subscriptions.push(relationshipsSubscription);
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  collapse() {
    this.expanded = !this.expanded;
  }

  addItem(): void {
    this.addRelationship();
  }

  addRelationship(): void {
    this.substanceFormRelationshipsService.addSubstanceRelationship();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-relationship-0`, 'center');
    });
  }

  deleteRelationship(relationship: SubstanceRelationship): void {
    this.substanceFormRelationshipsService.deleteSubstanceRelationship(relationship);
  }

}
