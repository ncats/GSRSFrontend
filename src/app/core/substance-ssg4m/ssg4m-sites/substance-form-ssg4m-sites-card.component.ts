import { Component, OnInit, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { Subscription } from 'rxjs';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../../substance-form/base-classes/substance-form-base-filtered-list';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
import { SubstanceFormSsg4mSitesService } from './substance-form-ssg4m-sites.service';
import { SpecifiedSubstanceG4mSite } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-substance-form-ssg4m-sites-card',
  templateUrl: './substance-form-ssg4m-sites-card.component.html',
  styleUrls: ['./substance-form-ssg4m-sites-card.component.scss']
})

export class SubstanceFormSsg4mSitesCardComponent extends SubstanceCardBaseFilteredList<SpecifiedSubstanceG4mSite>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {

  privateSites: Array<SpecifiedSubstanceG4mSite>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormSsg4mSiteService: SubstanceFormSsg4mSitesService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService) {
      super(gaService);
    }

  @Input()
  set sites(sites: Array<SpecifiedSubstanceG4mSite>) {
    this.privateSites = sites;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const siteSubscription = this.substanceFormSsg4mSiteService.specifiedSubstanceG4mSite.subscribe(sites => {
      this.sites = sites;
      this.filtered = sites;
      /*
      const searchSubscription = this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.notes, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      */
      //   this.subscriptions.push(searchSubscription);
      this.page = 0;
      this.pageChange();
    });
    this.subscriptions.push(siteSubscription);
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addItem(): void {
    this.addSite();
  }

  addSite(): void {
    this.substanceFormSsg4mSiteService.addSite();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-sites-0`, 'center');
    });
  }

  deleteSites(sites: SubstanceFormSsg4mSitesService): void {
   // this.substanceFormSsg4mSiteService.deleteSite(sites);
  }

  updateProcess($event) {

  }

}
