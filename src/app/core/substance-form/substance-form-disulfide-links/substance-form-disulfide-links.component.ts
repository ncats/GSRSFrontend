import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DisulfideLink, Link, SubstanceName, Subunit} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {ControlledVocabularyService} from '@gsrs-core/controlled-vocabulary';
import {MatDialog} from '@angular/material/dialog';
import {UtilsService} from '@gsrs-core/utils';
import {OverlayContainer} from '@angular/cdk/overlay';
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
    console.log(this.disulfideLinks);
  }

  ngAfterViewInit() {
    const disulfideLinksSubscription = this.substanceFormService.substanceDisulfideLinks.subscribe(disulfideLinks => {
      this.disulfideLinks = disulfideLinks;
      console.log(disulfideLinks);
    });

    this.subscriptions.push(disulfideLinksSubscription);
    const subunitsSubscription = this.substanceFormService.substanceSubunits.subscribe(subunits => {
      this.subscriptions.push(subunitsSubscription);
      this.subunits = subunits;
      this.countCysteine();
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  countCysteine(): void {
    console.log(this.subunits);
    this.cysteineBonds = 0;
    this.subunits.forEach(subunit => {
      this.cysteineBonds += (subunit.sequence.toUpperCase().split('C').length - 1);
      console.log(this.cysteineBonds);
    });
     this.cysteineBonds -= (this.disulfideLinks.length * 2);
    console.log(this.cysteineBonds);
  }

  addLink(): void {
    this.substanceFormService.addSubstanceDisulfideLink();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-disulfide-link-0`, 'center');
    });
  }

  deleteDisulfideLink(disulfideLink: DisulfideLink): void {
    this.substanceFormService.deleteSubstanceDisulfideLink(disulfideLink);
  }

}
