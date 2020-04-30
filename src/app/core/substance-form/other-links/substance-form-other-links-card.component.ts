import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList, SubstanceCardBaseList} from '@gsrs-core/substance-form/base-classes/substance-form-base-filtered-list';
import {Link} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import { SubstanceFormOtherLinksService } from './substance-form-other-links.service';

@Component({
  selector: 'app-substance-form-other-links-card',
  templateUrl: './substance-form-other-links-card.component.html',
  styleUrls: ['./substance-form-other-links-card.component.scss']
})
export class SubstanceFormOtherLinksCardComponent extends SubstanceCardBaseFilteredList<Link>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  otherLinks: Array<Link>;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private substanceFormOtherLinksService: SubstanceFormOtherLinksService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,

  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form otherLinks';
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Other Links');
  }

  ngAfterViewInit() {
    const otherLinksSubscription = this.substanceFormOtherLinksService.substanceOtherLinks.subscribe(otherLinks => {
      this.otherLinks = otherLinks;
    });
    this.subscriptions.push(otherLinksSubscription);
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addItem(): void {
    this.addOtherLink();
  }

  addOtherLink(): void {
    this.substanceFormOtherLinksService.addSubstanceOtherLink();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-other-links-0`, 'center');
    });
  }

  deleteLink(link: Link): void {
    this.substanceFormOtherLinksService.deleteSubstanceOtherLink(link);
  }

}
