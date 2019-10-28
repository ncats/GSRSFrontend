import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import {Link, Subunit} from '@gsrs-core/substance';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {OverlayContainer} from '@angular/cdk/overlay';

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

      /*const disulfideLinksSubscription = this.substanceFormService.substanceDisulfideLinks.subscribe(disulfideLinks => {
        disulfideLinks.forEach(link => {
          link.sites.forEach(site => {
            //this.disulfideSites.push(site);
            const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'disulfide'};
            this.allSites.push(newLink);
          });
        });
      });
      this.subscriptions.push(disulfideLinksSubscription);

      const otherLinksSubscription = this.substanceFormService.substanceOtherLinks.subscribe(otherLinks => {
        otherLinks.forEach(link => {
          if (link.sites) {
            link.sites.forEach(site => {
              const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'other'};
              this.allSites.push(newLink);
              //    this.otherSites.push(site);
            });
          }
        });
      });
      this.subscriptions.push(otherLinksSubscription);

      const glycosylationSubscription = this.substanceFormService.substanceGlycosylation.subscribe(glycosylation => {


        if (glycosylation.CGlycosylationSites) {

          glycosylation.CGlycosylationSites.forEach(site => {
            // this.CGlycosylationSites.push(site);
            const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'Cglycosylation'};
            this.allSites.push(newLink);
          });
        }

        if (glycosylation.NGlycosylationSites) {
          glycosylation.NGlycosylationSites.forEach(site => {
            //    this.NGlycosylationSites.push(site);
            const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'Nglycosylation'};
            this.allSites.push(newLink);
          });
        }

        if (glycosylation.OGlycosylationSites) {
          glycosylation.OGlycosylationSites.forEach(site => {
            //this.OGlycosylationSites.push(site);
            const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'Oglycosylation'};
            this.allSites.push(newLink);
          });
        }

      });*/

      const allSub = this.substanceFormService.allSites.subscribe(features => {
        this.allSites = features;
        console.log(features);
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
    const next = 'substance-subunit-' + this.subunits.length;
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
      console.log('other links dialog closed');
    });
    this.subscriptions.push(dialogSubscription);
  }

}
interface SubunitSequence {
  subunitIndex: number;
  sequencesSectionGroups: Array<SequenceSectionGroup>;
}


interface SequenceSectionGroup {
  sequenceSections: Array<SequenceSection>;
}

interface SequenceSection {
  sectionNumber: number;
  sectionUnits: Array<SequenceUnit>;
}

interface SequenceUnit {
  unitIndex: number;
  unitValue: string;
}
interface DisplaySite {
  type: string;
  subunit: number;
  residue: number;
}
