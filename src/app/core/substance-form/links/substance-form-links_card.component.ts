import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { SubstanceCardBaseFilteredList,  SubstanceCardBaseList} from '@gsrs-core/substance-form/base-classes/substance-form-base-filtered-list';
import {Link, Linkage, Site, Subunit} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import { SubstanceFormLinksService } from './substance-form-links.service';

@Component({
  selector: 'app-substance-form-links',
  templateUrl: './substance-form-links_card.component.html',
  styleUrls: ['./substance-form-links_card.component.scss']
})
export class SubstanceFormLinksCardComponent extends SubstanceCardBaseFilteredList<Linkage>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {

  links: Array<Linkage>;
  subunits: Array<Subunit>;
  remainingSites: Array<Site> = [];
  invalidSites = 0 ;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private substanceFormLinksService: SubstanceFormLinksService,
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,

  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form links';
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Links');
  }

  ngAfterViewInit() {
    const linksSubscription = this.substanceFormLinksService.substanceLinks.subscribe(links => {
      this.links = links;
      this.getRemainingSites();
    });
    this.subscriptions.push(linksSubscription);
    const subunitsSubscription = this.substanceFormService.substanceSubunits.subscribe(subunits => {
      this.subunits = subunits;
      this.getRemainingSites();
    });
   this.subscriptions.push(subunitsSubscription);

  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getRemainingSites(): void {
    let linkArray = [];
    const subunitArray = [];
    if (this.subunits && this.links) {
      this.subunits.forEach(unit => {
        if (unit.sequence != null && unit.sequence.length > 0) {
          for (let i = 2; i <= unit.sequence.length; i++) {
            subunitArray.push({subunitIndex: unit.subunitIndex, residueIndex: i});
          }
        }
      });
      this.links.forEach(link => {
        linkArray = linkArray.concat(link.sites);
      });
    }
    this.remainingSites = subunitArray.filter(item => {return !linkArray.some(function(obj2) {
      return (item.subunitIndex === obj2.subunitIndex && item.residueIndex === obj2.residueIndex);
     });
    });
      this.invalidSites = subunitArray.length - linkArray.length;

  }

  addItem(): void {
    this.addOtherLink();
  }

  addOtherLink(): void {
    this.substanceFormLinksService.addSubstanceLink();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-other-links-0`, 'center');
    });
  }

  deleteLink(link: Link): void {
    this.substanceFormLinksService.deleteSubstanceLink(link);
  }

}
