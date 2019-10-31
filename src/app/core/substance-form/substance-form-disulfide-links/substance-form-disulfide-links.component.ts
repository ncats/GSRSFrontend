import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {DisulfideLink, Site, Subunit} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';

@Component({
  selector: 'app-substance-form-disulfide-links',
  templateUrl: './substance-form-disulfide-links.component.html',
  styleUrls: ['./substance-form-disulfide-links.component.scss']
})
export class SubstanceFormDisulfideLinksComponent extends SubstanceCardBaseFilteredList<DisulfideLink> implements OnInit, AfterViewInit, OnDestroy {
  disulfideLinks: Array<DisulfideLink>;
  private subscriptions: Array<Subscription> = [];
  cysteineBonds: number;
  cysteine: Array<Site>;
  subunits: Array<Subunit>;
  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,

  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form disulfide Links';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Disulfide Links');
  }

  ngAfterViewInit() {
    const disulfideLinksSubscription = this.substanceFormService.substanceDisulfideLinks.subscribe(disulfideLinks => {
      this.disulfideLinks = disulfideLinks;
      this.countCysteine();
    });

    this.subscriptions.push(disulfideLinksSubscription);
    const subunitsSubscription = this.substanceFormService.substanceSubunits.subscribe(subunits => {
      this.subscriptions.push(subunitsSubscription);
      this.subunits = subunits;
      this.countCysteine();
    });
    this.subscriptions.push(subunitsSubscription);
    const cysteineSubscription = this.substanceFormService.substanceCysteineSites.subscribe(cysteine => {
      this.cysteine = cysteine;
      this.countCysteine();
    });
    this.subscriptions.push(cysteineSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  countCysteine(): void {
    this.cysteineBonds = 0;
    if(this.subunits){
      this.subunits.forEach(subunit => {
        this.cysteineBonds += (subunit.sequence.toUpperCase().split('C').length - 1);
      });
    }
    if (this.cysteine && this.cysteine.length){
      this.cysteineBonds = this.cysteine.length;
    } else {
      this.cysteineBonds -= (this.disulfideLinks.length * 2);
    }
    this.getSuggestions();
  }

  getSuggestions(): void {
    let available = [];
    if(this.subunits){
      for (let i = 0; i < this.subunits.length; i++) {
        const sequence = this.subunits[i].sequence;
        for (let j = 0; j < sequence.length; j++) {
          const site = sequence[j];
          if (site.toUpperCase() === 'C') {
            available.push({'residueIndex': (j + 1), 'subunitIndex': (i + 1)});
          }
        }
      }
    }
    this.disulfideLinks.forEach(link => {
      if(link.sites){
        link.sites.forEach(site => {
          available = available.filter(r => (r.residueIndex != site.residueIndex) || (r.subunitIndex != site.subunitIndex));
        });
      }

    });
  }

  addLink(): void {
    this.substanceFormService.addSubstanceDisulfideLink();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-disulfide-links-0`, 'center');
    });
    this.substanceFormService.emitDisulfideLinkUpdate();
  }

  deleteDisulfideLink(disulfideLink: DisulfideLink): void {
    this.substanceFormService.deleteSubstanceDisulfideLink(disulfideLink);
    this.substanceFormService.emitDisulfideLinkUpdate();
  }



}
