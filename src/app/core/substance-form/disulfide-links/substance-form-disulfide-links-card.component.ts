import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {DisulfideLink, Site, Subunit} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceCardBaseFilteredList, SubstanceCardBaseList} from '@gsrs-core/substance-form/base-classes/substance-form-base-filtered-list';
import { SubstanceFormDisulfideLinksService } from './substance-form-disulfide-links.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {OverlayContainer} from '@angular/cdk/overlay';
import { SubstanceFormService } from '../substance-form.service';

@Component({
  selector: 'app-substance-form-disulfide-links-card',
  templateUrl: './substance-form-disulfide-links-card.component.html',
  styleUrls: ['./substance-form-disulfide-links-card.component.scss']
})
export class SubstanceFormDisulfideLinksCardComponent extends SubstanceCardBaseFilteredList<DisulfideLink>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  disulfideLinks: Array<DisulfideLink>;
  private subscriptions: Array<Subscription> = [];
  cysteineBonds: number;
  cysteine: Array<Site>;
  subunits: Array<Subunit>;
  private overlayContainer: HTMLElement;
  constructor(
    private substanceFormDisulfideLinksService: SubstanceFormDisulfideLinksService,
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer

  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form disulfide Links';
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Disulfide Links');
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  ngAfterViewInit() {
    const disulfideLinksSubscription = this.substanceFormDisulfideLinksService.substanceDisulfideLinks.subscribe(disulfideLinks => {
      this.disulfideLinks = disulfideLinks;
      this.countCysteine();
    });

    this.subscriptions.push(disulfideLinksSubscription);
    const subunitsSubscription = this.substanceFormService.substanceSubunits.subscribe(subunits => {
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
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  countCysteine(): void {
    this.cysteineBonds = 0;
    if (this.subunits) {
      this.subunits.forEach(subunit => {
        this.cysteineBonds += (subunit.sequence.toUpperCase().split('C').length - 1);
      });
    }
    if (this.cysteine && this.cysteine.length) {
      this.cysteineBonds = this.cysteine.length;
    } else {
      this.cysteineBonds -= (this.disulfideLinks.length * 2);
    }
    this.getSuggestions();
  }

  getSuggestions(): void {
    let available = [];
    if (this.subunits) {
      for (let i = 0; i < this.subunits.length; i++) {
        const sequence = this.subunits[i].sequence;
        if (sequence != null && sequence.length > 0) {
          for (let j = 0; j < sequence.length; j++) {
            const site = sequence[j];
            if (site.toUpperCase() === 'C') {
              available.push({'residueIndex': (j + 1), 'subunitIndex': (i + 1)});
            }
          }
        }
      }
    }
    this.disulfideLinks.forEach(link => {
      if (link.sites) {
        link.sites.forEach(site => {
          available = available.filter(r => (r.residueIndex !== site.residueIndex) || (r.subunitIndex !== site.subunitIndex));
        });
      }

    });
  }

  addItem(): void {
    this.addLink();
  }

  addLink(): void {
    this.substanceFormDisulfideLinksService.addSubstanceDisulfideLink();
    setTimeout(() => {
      });
    this.substanceFormDisulfideLinksService.emitDisulfideLinkUpdate();
  }

  deleteDisulfideLink(disulfideLink: DisulfideLink): void {
    this.substanceFormDisulfideLinksService.deleteSubstanceDisulfideLink(disulfideLink);
    this.substanceFormDisulfideLinksService.emitDisulfideLinkUpdate();
  }

  deleteAllDisulfideLinks(): void {
    this.substanceFormDisulfideLinksService.deleteAllDisulfideLinks();
    this.substanceFormDisulfideLinksService.emitDisulfideLinkUpdate();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SubunitSelectorDialogComponent, {
      data: {'card': 'multi-disulfide', 'link': []},
      width: '1040px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newLinks => {
      this.overlayContainer.style.zIndex = null;
      if (newLinks) {
          this.substanceFormDisulfideLinksService.addCompleteDisulfideLinks(newLinks);
      }
    });
    this.subscriptions.push(dialogSubscription);
  }



}
