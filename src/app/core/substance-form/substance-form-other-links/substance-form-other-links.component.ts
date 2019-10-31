import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';
import {Link, SubstanceName} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';

@Component({
  selector: 'app-substance-form-other-links',
  templateUrl: './substance-form-other-links.component.html',
  styleUrls: ['./substance-form-other-links.component.scss']
})
export class SubstanceFormOtherLinksComponent extends SubstanceCardBaseFilteredList<Link> implements OnInit, AfterViewInit, OnDestroy {
  otherLinks: Array<Link>;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,

  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form otherLinks';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Other Links');
  }

  ngAfterViewInit() {
    const otherLinksSubscription = this.substanceFormService.substanceOtherLinks.subscribe(otherLinks => {
      this.otherLinks = otherLinks;
    });
    this.subscriptions.push(otherLinksSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addOtherLink(): void {
    this.substanceFormService.addSubstanceOtherLink();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-other-links-0`, 'center');
    });
  }

  deleteLink(link: Link): void {
    this.substanceFormService.deleteSubstanceOtherLink(link);
  }

}
