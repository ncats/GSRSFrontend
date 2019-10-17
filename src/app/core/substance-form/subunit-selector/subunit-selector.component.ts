import {AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2} from '@angular/core';
import {DisulfideLink, Feature, Glycosylation, Link, ProteinFeatures, Site, Subunit} from '@gsrs-core/substance';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ReuseReferencesDialogData} from '@gsrs-core/substance-form/references-dialogs/reuse-references-dialog-data.model';
import {ReuseReferencesDialogComponent} from '@gsrs-core/substance-form/references-dialogs/reuse-references-dialog.component';
import index from '@angular/cli/lib/cli';
import {any} from 'codelyzer/util/function';

@Component({
  selector: 'app-subunit-selector',
  templateUrl: './subunit-selector.component.html',
  styleUrls: ['./subunit-selector.component.scss']
})
export class SubunitSelectorComponent implements OnInit, AfterViewInit {
  @Input() card: any;
  @Input() link?: Array<any>;
  @Output() sitesUpdate = new EventEmitter<Array<Site>>();
  sites: Array<any> = [];
  subunitSequences: Array<SubunitSequence>;
  sitesDisplay: string;
  subunits: Array<Subunit>;
  otherLinks: Array<Link>;
  disulfideLinks: Array<DisulfideLink>;
  glycosylation: Glycosylation;
  otherSites: Array<any> = [];
  disulfideSites: Array<any> = [];
  glycosylationSites: Array<any> = [];
  CGlycosylationSites: Array<any> = [];
  NGlycosylationSites: Array<any> = [];
  OGlycosylationSites: Array<any> = [];
  allSites: Array<DisplaySite> = [];
  vocabulary: { [vocabularyTermValue: string]: VocabularyTerm } = {};
  private subscriptions: Array<Subscription> = [];
  features: Array<Feature>;
  selectState: string;
  newFeature: Array<Site> = [];
  testSequences: Array<TestSequence>;

  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    private cvService: ControlledVocabularyService,
    private render: Renderer2
 // public dialogRef: MatDialogRef<ReuseReferencesDialogComponent>,
  //@Inject(MAT_DIALOG_DATA) private data: ReuseReferencesDialogData
  ) {
}

  ngOnInit() {
    this.getVocabularies();
    if ( this.link && this.link.length > 0) {
      this.sites = this.link;
      console.log('updating sites');
      this.updateDisplay();
      this.sitesUpdate.emit(this.sites);
    }
    this.selectState = 'first';
  }

  ngAfterViewInit() {
    const subunitsSubscription = this.substanceFormService.substanceSubunits.subscribe(subunits => {
      this.subunits = subunits;
      console.log('component subunits updated');
      setTimeout(() => {this.processSubunits2(); });
     //this.processSubunits();
    });
    this.subscriptions.push(subunitsSubscription);

      const disulfideLinksSubscription = this.substanceFormService.substanceDisulfideLinks.subscribe(disulfideLinks => {
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
        this.glycosylation = glycosylation;


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

        const featuresSubscription = this.substanceFormService.CustomFeatures.subscribe(features => {
          this.features = features;
          if (features) {
            this.features = features;
          }

      });

      });
      this.subscriptions.push(glycosylationSubscription);
      setTimeout(() => {this.addStyle2(); });



  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('AMINO_ACID_RESIDUE').subscribe(response => {
      this.vocabulary = response['AMINO_ACID_RESIDUE'].dictionary;
    }, error => {
    });
  }

  removeFeature() {
    if (this.newFeature[1]) {
      this.addFeature(true);
      this.addStyle2();
      this.selectState = 'first';
      this.newFeature = [];
    } else if (this.newFeature[0]) {
      this.testSequences[this.newFeature[0].subunitIndex - 1].subunits[this.newFeature[0].residueIndex - 1].class = '';
    }
  }

  addFeature(reverse?: boolean) {
    if (this.newFeature[0].subunitIndex == this.newFeature[1].subunitIndex) {
      const subunitIndex = this.newFeature[0].subunitIndex;
      let start = this.newFeature[0].residueIndex;
      let end = this.newFeature[1].residueIndex;
      if ( this.newFeature[0].residueIndex > this.newFeature[1].residueIndex) {
        start = this.newFeature[1].residueIndex;
        end = this.newFeature[0].residueIndex;
      }
      for (let i = start; i <= end; i++) {
        if (reverse) {
          this.testSequences[subunitIndex - 1].subunits[i - 1].class = '';
        } else {
          this.testSequences[subunitIndex - 1].subunits[i - 1].class = 'chosen';
        }

      }
    }
  }

  toggleSite(subunit: any, residue: any, value: any, event: any): void {
    const newobj = {subunitIndex: subunit, residueIndex: residue};
    if (this.card === 'feature') {
      if (this.selectState === 'first') {
        this.newFeature[0] = newobj;
        this.render.addClass(event.target, 'chosen');
        this.selectState = 'last';
      } else if (this.selectState === 'last') {
        if (this.newFeature[0] === newobj) {
          this.selectState = 'first';
          this.render.removeClass(event.target, 'chosen');
        } else {
          this.newFeature[1] = newobj;
          this.addFeature();
          this.selectState = 'finished';
        }

      } else {
      }
    } else {
      const inSites = this.sites.some(r => (r.residueIndex == residue) && (r.subunitIndex == subunit));
      if (inSites) {
        this.sites = this.sites.filter(function(r) { return (r.residueIndex !== residue) || (r.subunitIndex !== subunit); });
        this.render.removeClass(event.target, 'chosen');
      } else {

        this.sites.push(newobj);
        this.render.addClass(event.target, 'chosen');
      }
      this.updateDisplay();
      this.sitesUpdate.emit(this.sites);
    }

  }

  updateDisplay() {
    console.log('updating idsplay');
    this.sites = this.sites.sort(function (s1, s2) {
      if (s1.subUnitIndex > s2.subunitIndex) {
        return 1;
      } else if (s1.subunitIndex < s2.subunitIndex) {
        return -1;
      } else if (s1.residueIndex > s2.residueIndex) {
        return 1;
      } else if (s1.residueIndex < s2.residueIndex) {
      } else {
        return 1;
      }
    });
      this.sitesDisplay = this.substanceFormService.siteString(this.sites);

    }






  addStyle2(): void {
    console.log('about to add style');
    if (this.testSequences && this.testSequences[0].subunits) {
      this.allSites.forEach(site => {
        if (this.testSequences[site.subunit - 1].subunits) {
          this.testSequences[site.subunit - 1].subunits[site.residue - 1].class = site.type;
        } else {
        }
      });
      this.sites.forEach(site => {
        if (this.testSequences[site.subunit - 1].subunits) {
          this.testSequences[site.subunit - 1].subunits[site.residue - 1].class = 'chosen';
        } else {
        }
      });
    }

  }

  private processSubunits2(): void {
    console.log('processing');
    this.testSequences = [];
    let subunitIndex = 1;
    this.subunits.forEach(subunit => {
      console.log(subunit);
      console.log(subunit.length + '-' + subunit.sequence.length);
      const subsections = [];
      let currentSections = [];
      for (let count = 0; count < subunit.sequence.length; count = count + 10) {
        if ((count + 10) >= subunit.sequence.length) {
          currentSections.push([count, subunit.sequence.length]);
          subsections.push(currentSections);
        } else {
          currentSections.push([count, count + 10]);
        }
        if ((count + 10) % 50 === 0) {
          subsections.push(currentSections);
          currentSections = [];
        }
      }
      const thisTest: TestSequence =  {
        subunitIndex: subunitIndex,
        subunits: [],
        subsections: subsections,
        subgroups: currentSections
      };
      let index = 0;
      const indexEnd = subunit.sequence.length;
      while (index <= indexEnd) {
        if (subunit.sequence[index]) {
          const sequenceUnit: SequenceUnit = {
            unitIndex: index + 1,
            unitValue: subunit.sequence[index],
            class: ''
          };
          thisTest.subunits.push(sequenceUnit);
        }
        index++;
      }
      this.testSequences.push(thisTest);
      subunitIndex++;
    });
    setTimeout(() => {this.addStyle2(); });
  }


  private processSubunits(): void {
    this.subunitSequences = [];
    this.subunits.forEach(subunit => {
      const subunitSequence: SubunitSequence = {
        subunitIndex: subunit.subunitIndex,
        sequencesSectionGroups: []
      };
      this.subunitSequences.push(subunitSequence);
      this.addSequenceSectionsGroup(subunitSequence, subunit.sequence.replace(/\s/g, ''));
    });
  }

  private addSequenceSectionsGroup(subunitSequence: SubunitSequence, squenceString: string = '', indexStart: number = 0) {
    const sequenceSectionLength = 50;
    if (squenceString.length > (indexStart + 1)) {
      const sequenceSectionGroup: SequenceSectionGroup = {
        sequenceSections: []
      };
      subunitSequence.sequencesSectionGroups.push(sequenceSectionGroup);
      const sequenceSectionString = squenceString.substr(indexStart, sequenceSectionLength);

      this.addSequenceSections(sequenceSectionGroup, sequenceSectionString, indexStart);

      if (sequenceSectionString.length === sequenceSectionLength) {
        indexStart = indexStart + sequenceSectionLength;
        this.addSequenceSectionsGroup(subunitSequence, squenceString, indexStart);
      }
    }
  }

  getTooltipMessage(subunitIndex: number, unitIndex: number, unitValue: string, type: string): string {
    const vocab = (this.vocabulary[unitValue] === undefined ? 'UNDEFINED' : this.vocabulary[unitValue].display);
    return `${subunitIndex} - ${unitIndex}: ${unitValue.toUpperCase()} (${vocab}) \n ${type}`;
  }

  private addSequenceSections(
    sectionGroup: SequenceSectionGroup,
    sequenceSectionString: string = '',
    sectionNumberAddend: number,
    index: number = 0,
    indexEnd: number = 9) {
    const indexIncrement = 10;

    if (sequenceSectionString !== '') {

      const sequenceSection: SequenceSection = {
        sectionNumber: 0,
        sectionUnits: []
      };

      while (index <= indexEnd) {
        if (sequenceSectionString[index]) {
          const sequenceUnit: SequenceUnit = {
            unitIndex: index + sectionNumberAddend + 1,
            unitValue: sequenceSectionString[index],
            class: ''
          };

          sequenceSection.sectionUnits.push(sequenceUnit);
          index++;
        } else {
          break;
        }
      }

      sequenceSection.sectionNumber = index + sectionNumberAddend;

      sectionGroup.sequenceSections.push(sequenceSection);

      if (sequenceSectionString.length > index) {
        indexEnd = indexEnd + indexIncrement;
        this.addSequenceSections(sectionGroup, sequenceSectionString, sectionNumberAddend, index, indexEnd);
      }
    }
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
  class?: string;
}

interface DisplaySite {
  type: string;
  subunit: number;
  residue: number;
}


interface TestSequenceSet {
 sequences: Array<TestSequence>;
}

interface TestSequence {
  subunitIndex?: number;
  subsections?: Array<any>;
  subgroups?: Array<any>;
  subunits?: Array<SequenceUnit>;
}
