import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {DisulfideLink, Link, SubstanceName} from '@gsrs-core/substance';
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
      console.log(subunits);
      subunits.forEach(subunit => {
        this.cysteineBonds = (subunit.sequence.match(/C/g) || []).length;
      });
      console.log(this.cysteineBonds);
      this.subscriptions.push(subunitsSubscription);
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addLink(): void {
    this.substanceFormService.addSubstanceOtherLink();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-name-0`, 'center');
    });
  }

  deleteDisulfideLink(disulfideLink: DisulfideLink): void {
    this.substanceFormService.deleteSubstanceDisulfideLink(disulfideLink);
  }

}
