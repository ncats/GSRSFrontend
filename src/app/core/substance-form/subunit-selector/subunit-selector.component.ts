import {AfterViewInit, Component, Inject, Input, OnInit, Output} from '@angular/core';
import {DisulfideLink, Glycosylation, Link, Subunit} from '@gsrs-core/substance';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {Subscription} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ReuseReferencesDialogData} from '@gsrs-core/substance-form/references-dialogs/reuse-references-dialog-data.model';
import {ReuseReferencesDialogComponent} from '@gsrs-core/substance-form/references-dialogs/reuse-references-dialog.component';

@Component({
  selector: 'app-subunit-selector',
  templateUrl: './subunit-selector.component.html',
  styleUrls: ['./subunit-selector.component.scss']
})
export class SubunitSelectorComponent implements OnInit, AfterViewInit {
 // @Input() card: any;
  //@Output() sites: any;
  subunitSequences: Array<SubunitSequence>;
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



  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    private cvService: ControlledVocabularyService
 // public dialogRef: MatDialogRef<ReuseReferencesDialogComponent>,
  //@Inject(MAT_DIALOG_DATA) private data: ReuseReferencesDialogData
  ) {
}

  ngOnInit() {
    this.getVocabularies();
  }

  ngAfterViewInit() {
    const subunitsSubscription = this.substanceFormService.substanceSubunits.subscribe(subunits => {
      this.subunits = subunits;

      this.processSubunits();
    });
    this.subscriptions.push(subunitsSubscription);
    if (this.subunitSequences) {
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
      console.log(disulfideLinksSubscription);

      const otherLinksSubscription = this.substanceFormService.substanceOtherLinks.subscribe(otherLinks => {
        otherLinks.forEach(link => {
          link.sites.forEach(site => {
            const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'other'};
               this.allSites.push(newLink);
        //    this.otherSites.push(site);
          });
        });
      });
      this.subscriptions.push(otherLinksSubscription);

      const glycosylationSubscription = this.substanceFormService.substanceGlycosylation.subscribe(glycosylation => {
        this.glycosylation = glycosylation;
        glycosylation.CGlycosylationSites.forEach(site => {
          // this.CGlycosylationSites.push(site);
          const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'Cglycosylation'};
            this.allSites.push(newLink);
        });
        glycosylation.NGlycosylationSites.forEach(site => {
      //    this.NGlycosylationSites.push(site);
          const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'Nglycosylation'};
         this.allSites.push(newLink);
        });
        glycosylation.OGlycosylationSites.forEach(site => {
          //this.OGlycosylationSites.push(site);
          const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'Oglycosylation'};
          this.allSites.push(newLink);
        });
      });
      this.subscriptions.push(glycosylationSubscription);

      if (this.allSites) {
        this.addStyle();
      }
    }


  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('AMINO_ACID_RESIDUE').subscribe(response => {
      this.vocabulary = response['AMINO_ACID_RESIDUE'].dictionary;
    }, error => {
    });
  }

  addStyle(): void {
    this.subunitSequences.forEach(subunitSequence => {
      subunitSequence.sequencesSectionGroups.forEach(sequenceSectionGroup => {
        sequenceSectionGroup.sequenceSections.forEach(sequenceSectionSite => {
          sequenceSectionSite.sectionUnits.forEach(sequenceUnit => {
            this.allSites.forEach(site => {
             if ((site.residue === sequenceUnit.unitIndex) && (site.subunit === subunitSequence.subunitIndex)) {
                sequenceUnit.unitValue = sequenceUnit.unitValue;
                sequenceUnit.class = site.type;
                console.log('found!' + site.subunit);
              }
            });

          });
        });
      });
    });

    console.log(this.subunitSequences);
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
