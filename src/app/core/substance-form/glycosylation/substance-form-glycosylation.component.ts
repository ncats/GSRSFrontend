import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/base-classes/substance-form-base-filtered-list';
import {Glycosylation, Site, SubstanceName} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {OverlayContainer} from '@angular/cdk/overlay';
import { SubstanceFormGlycosylationService } from './substance-form-glycosylation.service';
@Component({
  selector: 'app-substance-form-glycosylation',
  templateUrl: './substance-form-glycosylation.component.html',
  styleUrls: ['./substance-form-glycosylation.component.scss']
})
// eslint-disable-next-line max-len
export class SubstanceFormGlycosylationComponent extends SubstanceCardBaseFilteredList<SubstanceName> implements OnInit, AfterViewInit, OnDestroy {
  glycosylation: Glycosylation;
  glycosylationTypes: Array<VocabularyTerm>;
  private subscriptions: Array<Subscription> = [];
  private overlayContainer: HTMLElement;
  constructor(
    private substanceFormGlycosylationService: SubstanceFormGlycosylationService,
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    private cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer

  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form glycosylation';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Glycosylation');
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.getVocabularies();
  }

  ngAfterViewInit() {
    const glycosylationSubscription = this.substanceFormGlycosylationService.substanceGlycosylation.subscribe(glycosylation => {
      this.glycosylation = glycosylation;
  });
    this.subscriptions.push(glycosylationSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  clearAll(): void {
    this.glycosylation.CGlycosylationSites = [];
    this.glycosylation.NGlycosylationSites = [];
    this.glycosylation.OGlycosylationSites = [];
    this.glycosylation.glycosylationType = null;
    this.substanceFormGlycosylationService.emitGlycosylationUpdate();
  }

  getVocabularies(): void {
    const subscription = this.cvService.getDomainVocabulary('GLYCOSYLATION_TYPE').subscribe(response => {
      this.glycosylationTypes = response['GLYCOSYLATION_TYPE'].list;
    });
    this.subscriptions.push(subscription);
  }

  openDialog(type: string): void {
    let param = {};
    if (type === 'N') {
      param = this.glycosylation.NGlycosylationSites;
    } else if (type === 'C') {
      param = this.glycosylation.CGlycosylationSites;
    } else {
      param = this.glycosylation.OGlycosylationSites;
    }
      const dialogRef = this.dialog.open(SubunitSelectorDialogComponent, {
      data: {'card': type, 'link': param},
      width: '1040px',
      panelClass: 'subunit-dialog'
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(newLinks => {
      this.overlayContainer.style.zIndex = null;
      if (newLinks) {
        if (type === 'N') {
          this.glycosylation.NGlycosylationSites = newLinks;
        } else if (type === 'C') {
          this.glycosylation.CGlycosylationSites = newLinks;
        } else {
          this.glycosylation.OGlycosylationSites = newLinks;
        }
        this.substanceFormGlycosylationService.emitGlycosylationUpdate();
      }
    });
    this.subscriptions.push(dialogSubscription);
  }

  siteDisplay(sites: Array<Site>) {
    return this.substanceFormService.siteString(sites);
  }

}
