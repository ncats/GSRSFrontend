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
import {DisplaySite, SubunitSequence} from '@gsrs-core/substance-form/substance-form.model';

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
  substanceType: string;
  private overlayContainer: HTMLElement;
  features: any;
  allSites: Array<Array<DisplaySite>> = [];
  subcount =0;
  sequenceSites: Array<any> = [];

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

    const definitionSubscription = this.substanceFormService.definition.subscribe( definition => {
      this.substanceType = definition.substanceClass;
    });
    definitionSubscription.unsubscribe();
    const subunitsSubscription = this.substanceFormService.substanceSubunits.subscribe(subunits => {
      this.subunits = subunits;
      this.filtered = subunits;
      this.subscriptions.push(subunitsSubscription);

      this.subunits.forEach(unit => {
        this.allSites[unit.subunitIndex] = [];
      });
    });
    /*
      if (this.substanceType === 'protein'){
        const disulfideLinksSubscription = this.substanceFormService.substanceDisulfideLinks.subscribe(disulfideLinks => {
          disulfideLinks.forEach(link => {
            if (link.sites) {
              link.sites.forEach(site => {
               // if (site.subunitIndex === this.subunit.subunitIndex) {
                  const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'disulfide'};
                  this.allSites[site.subunitIndex].push(newLink);
                //}
              });
            }
          });
        });
        this.subscriptions.push(disulfideLinksSubscription);

        const otherLinksSubscription = this.substanceFormService.substanceOtherLinks.subscribe(otherLinks => {
          otherLinks.forEach(link => {
            if (link.sites) {
              link.sites.forEach(site => {
                  const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'other'};
                  this.allSites[site.subunitIndex].push(newLink);

              });
            }
          });
        });
        this.subscriptions.push(otherLinksSubscription);

        const glycosylationSubscription = this.substanceFormService.substanceGlycosylation.subscribe(glycosylation => {


          if (glycosylation.CGlycosylationSites) {

            glycosylation.CGlycosylationSites.forEach(site => {
                const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'Cglycosylation'};
                this.allSites[site.subunitIndex].push(newLink);

            });
          }

          if (glycosylation.NGlycosylationSites) {
            glycosylation.NGlycosylationSites.forEach(site => {

                const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'Nglycosylation'};
                this.allSites[site.subunitIndex].push(newLink);

            });
          }

          if (glycosylation.OGlycosylationSites) {
            glycosylation.OGlycosylationSites.forEach(site => {
                const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'Oglycosylation'};
                this.allSites[site.subunitIndex].push(newLink);
            });
          }
          this.subscriptions.push(glycosylationSubscription);

        });
      }

      const modificationSubscription = this.substanceFormService.substanceStructuralModifications.subscribe( mod => {
        mod.forEach(sites => {
          sites.sites.forEach(site => {
            const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'modification'};
            this.allSites[site.subunitIndex].push(newLink);
          });
        });
      });
      this.subscriptions.push(modificationSubscription);

      const propertiesSubscription = this.substanceFormService.substanceProperties.subscribe( properties => {
        properties.forEach(prop => {
          if (prop.propertyType === 'PROTEIN FEATURE' || prop.propertyType === 'NUCLEIC ACID FEATURE') {
            const featArr = prop.value.nonNumericValue.split(';');
            featArr.forEach(f => {
            //  if (Number(f.split('_')[0]) === this.subunit.subunitIndex) {
                const sites = f.split('-');
                const subunitIndex = Number(f.split('_')[0]);
                console.log(subunitIndex);
                for (let i = Number(sites[0].split('_')[1]); i <= Number(sites[1].split('_')[1]); i++ ) {
                  const newLink: DisplaySite = {residue: Number(i), subunit: Number(f.split('_')[0]), type: 'feature' };
                  this.allSites[subunitIndex].push(newLink);
                }
            //  }
            });
          }
        });
      });
      console.log(this.allSites);
      this.subscriptions.push(propertiesSubscription);
*/
  }

  getSites(index: number): Array<DisplaySite> {
    //console.log(this.subcount);
    this.subcount = this.subcount +1;
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
      width: '1040px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newFeature => {
      if (newFeature) {
        this.substanceFormService.addSubstancePropertyFromFeature(newFeature);
        setTimeout(() => {
          this.scrollToService.scrollToElement(`substance-property-0`, 'center');
        });
      }
      this.overlayContainer.style.zIndex = null;
    });
    this.subscriptions.push(dialogSubscription);
  }

}

