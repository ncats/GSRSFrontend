import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import {Linkage, Site, Subunit, Sugar} from '@gsrs-core/substance';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/base-classes/substance-form-base-filtered-list';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {OverlayContainer} from '@angular/cdk/overlay';
import {DisplaySite, SubunitSequence} from '@gsrs-core/substance-form/substance-form.model';
import { SubstanceFormPropertiesService } from '../properties/substance-form-properties.service';

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
  sequenceType = '';
  substanceType: string;
  private overlayContainer: HTMLElement;
  features: any;
  allSites: Array<Array<DisplaySite>> = [];
  subcount = 0;
  sequenceSites: Array<any> = [];
  sugars: Array<Sugar>;
  links: Array<Linkage>;

  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    private cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
    private substanceFormPropertiesService: SubstanceFormPropertiesService
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form subunits';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Subunits');
    this.overlayContainer = this.overlayContainerService.getContainerElement();

  }

  ngAfterViewInit(): void {

    const definitionSubscription = this.substanceFormService.definition.subscribe( definition => {
      this.substanceType = definition.substanceClass;
    });
    definitionSubscription.unsubscribe();
    this.canAddItemUpdate.emit(true);
    const subunitsSubscription = this.substanceFormService.substanceSubunits.subscribe(subunits => {
      this.subunits = subunits;
      this.filtered = subunits;


      this.subunits.forEach(unit => {
        this.allSites[unit.subunitIndex] = [];
      });
    });
    this.subscriptions.push(subunitsSubscription);
  }

  getSites(index: number): Array<DisplaySite> {
    this.subcount = this.subcount + 1;
    return this.allSites[index];
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

  addItem(): void {
    this.addSubunit();
  }

  addSubunit(): void {
    this.substanceFormService.addSubstanceSubunit();
    const next = 'substance-subunit-' + (this.subunits.length - 1);
    setTimeout(() => {
      this.scrollToService.scrollToElement(next, 'center');
    });
    this.substanceFormService.emitSubunitUpdate();
  }

  deleteSubunit(subunit: Subunit): void {
    this.substanceFormService.deleteSubstanceSubunit(subunit);
  }

  getSequence(index: number): any {
    let sequence = {};
    this.subunitSequences.forEach(v => {
      if (v.subunitIndex === (index + 1)) {
        sequence = v;
      }
    });
    return sequence;

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SubunitSelectorDialogComponent, {
      data: {'card': 'feature', 'link': []},
      width: '1040px',
      panelClass: 'subunit-dialog'
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(newFeature => {
      if (newFeature) {
        this.substanceFormPropertiesService.addSubstancePropertyFromFeature(newFeature);
        setTimeout(() => {
          // this.scrollToService.scrollToElement(`substance-property-0`, 'center');
          alert('Feature added under "Properties"');
        });
      }
      this.overlayContainer.style.zIndex = null;
    });
    this.subscriptions.push(dialogSubscription);
  }

  openAnyDialog(): void {
    const dialogRef = this.dialog.open(SubunitSelectorDialogComponent, {
      data: {'card': 'any', 'link': []},
      width: '1040px',
      panelClass: 'subunit-dialog'
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      if (response) {
        if (response.siteType === 'feature') {
          this.substanceFormPropertiesService.addSubstancePropertyFromFeature(response.sentFeature);
        } else {
          this.substanceFormService.addAnySiteType(response);
        }
      }
      }
    );
    this.subscriptions.push(dialogSubscription);
  }

}

