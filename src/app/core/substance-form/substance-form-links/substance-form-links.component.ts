import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';
import {Link, Linkage, Site, Subunit} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';

@Component({
  selector: 'app-substance-form-links',
  templateUrl: './substance-form-links.component.html',
  styleUrls: ['./substance-form-links.component.scss']
})
export class SubstanceFormLinksComponent extends SubstanceCardBaseFilteredList<Linkage> implements OnInit, AfterViewInit, OnDestroy {
  links: Array<Linkage>;
  subunits: Array<Subunit>;
  remainingSites: Array<Site> = [];
  invalidSites = 0 ;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,

  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form links';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Links');
  }

  ngAfterViewInit() {
    const linksSubscription = this.substanceFormService.substanceLinks.subscribe(links => {
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

    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getRemainingSites(): void {
    let linkArray = [];
    const subunitArray = [];
    if (this.subunits && this.links) {
      this.subunits.forEach(unit => {
        for (let i = 2; i <= unit.sequence.length; i++) {
          subunitArray.push({subunitIndex: unit.subunitIndex, residueIndex: i});
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

  addOtherLink(): void {
    this.substanceFormService.addSubstanceLink();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-links-0`, 'center');
    });
  }

  deleteLink(link: Link): void {
    this.substanceFormService.deleteSubstanceLink(link);
  }

}
