<<<<<<< HEAD
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '../substance-form-base-filtered-list';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceRelationship } from '@gsrs-core/substance/substance.model';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-substance-form-relationships',
  templateUrl: './substance-form-relationships.component.html',
  styleUrls: ['./substance-form-relationships.component.scss']
})
export class SubstanceFormRelationshipsComponent extends SubstanceCardBaseFilteredList<SubstanceRelationship>
  implements OnInit, AfterViewInit, OnDestroy {
  relationships: Array<SubstanceRelationship>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Relationships');
    this.analyticsEventCategory = 'substance form relationships';
  }

  ngAfterViewInit() {
    const relationshipsSubscription = this.substanceFormService.substanceRelationships.subscribe(relationships => {
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
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addRelationship(): void {
    this.substanceFormService.addSubstanceRelationship();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-relationship-0`, 'center');
    });
  }

  deleteRelationship(relationship: SubstanceRelationship): void {
    this.substanceFormService.deleteSubstanceRelationship(relationship);
  }

}
=======
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '../substance-form-base-filtered-list';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceRelationship } from '@gsrs-core/substance/substance.model';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-substance-form-relationships',
  templateUrl: './substance-form-relationships.component.html',
  styleUrls: ['./substance-form-relationships.component.scss']
})
export class SubstanceFormRelationshipsComponent extends SubstanceCardBaseFilteredList<SubstanceRelationship>
  implements OnInit, AfterViewInit, OnDestroy {
  relationships: Array<SubstanceRelationship>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Relationships');
    this.analyticsEventCategory = 'substance form relationships';
  }

  ngAfterViewInit() {
    const relationshipsSubscription = this.substanceFormService.substanceRelationships.subscribe(relationships => {
      this.relationships = relationships;
      this.filtered = relationships;
      const searchSubscription = this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.relationships, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.subscriptions.push(searchSubscription);
      this.page = 0;
      this.pageChange();
    });
    this.subscriptions.push(relationshipsSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addRelationship(): void {
    this.substanceFormService.addSubstanceRelationship();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-relationship-0`, 'center');
    });
  }

  deleteRelationship(relationship: SubstanceRelationship): void {
    this.substanceFormService.deleteSubstanceRelationship(relationship);
  }

}
>>>>>>> development_version_update
