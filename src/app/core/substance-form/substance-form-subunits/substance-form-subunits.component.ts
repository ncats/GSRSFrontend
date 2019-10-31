import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import {Subunit} from '@gsrs-core/substance';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {OverlayContainer} from '@angular/cdk/overlay';
import {SubunitSequence} from '@gsrs-core/substance-form/substance-form.model';

@Component({
  selector: 'app-substance-form-subunits',
  templateUrl: './substance-form-subunits.component.html',
  styleUrls: ['./substance-form-subunits.component.scss']
})
export class SubstanceFormSubunitsComponent extends SubstanceCardBaseFilteredList<Subunit> implements OnInit, AfterViewInit, OnDestroy {
  subunits: Array<Subunit> = [];
  subunitSequences: Array<SubunitSequence> = [];
  vocabulary: { [vocabularyTermValue: string]: VocabularyTerm } = {};
  private subscriptions: Array<Subscription> = [];
  toggle = {};
  view = 'details';
  private overlayContainer: HTMLElement;
  features: any;
  allSites: Array<DisplaySite> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    private cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form subunits';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Subunits');
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  ngAfterViewInit(): void {
    const subunitsSubscription = this.substanceFormService.substanceSubunits.subscribe(subunits => {
      this.subunits = subunits;
      this.filtered = subunits;
      this.subscriptions.push(subunitsSubscription);

      const featuresSubscription = this.substanceFormService.CustomFeatures.subscribe(features => {
        this.features = features;
        if (features) {
          this.features = features;
        }
      });
        this.subscriptions.push(featuresSubscription);

      const allSub = this.substanceFormService.allSites.subscribe(features => {
        this.allSites = features;
      });
      this.subscriptions.push(allSub);
  });
  }

  getSites(index: number): Array<DisplaySite> {
    return this.allSites.filter(s => (s.subunit === index));
  }

    ngOnDestroy() {
      this.subscriptions.forEach(subscription => {
        subscription.unsubscribe();
      });
    }

  updateView(event): void {
    this.gaService.sendEvent(this.analyticsEventCategory, 'button:view-update', event.value);
    this.view = event.value;
  }

  addSubunit(): void {
    this.substanceFormService.addSubstanceSubunit();
    const next = 'substance-subunit-' + (this.subunits.length - 1);
    const element = document.getElementById(next) as HTMLElement;
    setTimeout(() => {
      this.scrollToService.scrollToElement(next, 'center');
    });
    this.substanceFormService.emitSubunitUpdate();
  }

  deleteSubunit(subunit: Subunit): void {
    this.substanceFormService.deleteSubstanceSubunit(subunit);
  }

  getSequence(index: number): any {
    let testing = {};
    this.subunitSequences.forEach(v => {
      if (v.subunitIndex === (index + 1)) {
        testing = v;
      }
    });
    return testing;

  }


  openDialog(): void {

    const dialogRef = this.dialog.open(SubunitSelectorDialogComponent, {
      data: {'card': 'feature', 'link': []},
      width: '1038px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newFeature => {
      if (newFeature) {
        this.substanceFormService.addSubstancePropertyFromFeature(newFeature);
      }
      this.overlayContainer.style.zIndex = null;
    });
    this.subscriptions.push(dialogSubscription);
  }

}

interface DisplaySite {
  type: string;
  subunit: number;
  residue: number;
}
