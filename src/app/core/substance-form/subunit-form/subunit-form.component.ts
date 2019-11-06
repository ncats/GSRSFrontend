import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Subunit} from '@gsrs-core/substance';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {Subject, Subscription} from 'rxjs';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
@Component({
  selector: 'app-subunit-form',
  templateUrl: './subunit-form.component.html',
  styleUrls: ['./subunit-form.component.scss']
})

export class SubunitFormComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() subunit: Subunit;
  @Input() view: string;
  @Input() sites?: Array<any>;
  @Output() subunitDeleted = new EventEmitter<Subunit>();
  subunitSequence: SubunitSequence;
  vocabulary: { [vocabularyTermValue: string]: VocabularyTerm } = {};
  private subscriptions: Array<Subscription> = [];
  toggle = {};
  allSites: Array<DisplaySite> = [];
  features: Array<any> = [];


  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    private cvService: ControlledVocabularyService,
  ) {

  }



  ngOnInit() {
    this.getVocabularies();
  }

  ngAfterViewInit() {

    if (this.view === 'protein'){
      const disulfideLinksSubscription = this.substanceFormService.substanceDisulfideLinks.subscribe(disulfideLinks => {
        disulfideLinks.forEach(link => {
          if (link.sites) {
            link.sites.forEach(site => {
              if (site.subunitIndex === this.subunit.subunitIndex) {
                const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'disulfide'};
                this.allSites.push(newLink);
              }
            });
          }
        });
      });
      this.subscriptions.push(disulfideLinksSubscription);

      const otherLinksSubscription = this.substanceFormService.substanceOtherLinks.subscribe(otherLinks => {
        otherLinks.forEach(link => {
          if (link.sites) {
            link.sites.forEach(site => {
              if (site.subunitIndex === this.subunit.subunitIndex) {
                const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'other'};
                this.allSites.push(newLink);
              }
            });
          }
        });
      });
      this.subscriptions.push(otherLinksSubscription);

      const glycosylationSubscription = this.substanceFormService.substanceGlycosylation.subscribe(glycosylation => {


        if (glycosylation.CGlycosylationSites) {

          glycosylation.CGlycosylationSites.forEach(site => {
            if (site.subunitIndex === this.subunit.subunitIndex) {
              const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'Cglycosylation'};
              this.allSites.push(newLink);
            }
          });
        }

        if (glycosylation.NGlycosylationSites) {
          glycosylation.NGlycosylationSites.forEach(site => {
            if (site.subunitIndex === this.subunit.subunitIndex) {
              const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'Nglycosylation'};
              this.allSites.push(newLink);
            }
          });
        }

        if (glycosylation.OGlycosylationSites) {
          glycosylation.OGlycosylationSites.forEach(site => {
            if (site.subunitIndex === this.subunit.subunitIndex) {
              const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'Oglycosylation'};
              this.allSites.push(newLink);
            }

          });
        }
        this.subscriptions.push(glycosylationSubscription);

      });
    }

    const modificationSubscription = this.substanceFormService.substanceStructuralModifications.subscribe( mod => {
      mod.forEach(sites => {
        sites.sites.forEach(site => {
          const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'modification'};
          this.allSites.push(newLink);
        });
      });
    });
    this.subscriptions.push(modificationSubscription);

    const propertiesSubscription = this.substanceFormService.substanceProperties.subscribe( properties => {
      properties.forEach(prop => {
        if (prop.propertyType === 'PROTEIN FEATURE' || prop.propertyType === 'NUCLEIC ACID FEATURE') {
          const featArr = prop.value.nonNumericValue.split(';');
          featArr.forEach(f => {
            if (Number(f.split('_')[0]) === this.subunit.subunitIndex) {
              const sites = f.split('-');
              for (let i = Number(sites[0].split('_')[1]); i <= Number(sites[1].split('_')[1]); i++ ) {
                const newLink: DisplaySite = {residue: Number(i), subunit: this.subunit.subunitIndex, type: 'feature' };
                this.allSites.push(newLink);
              }
            }
          });
        }
      });
    });

    this.subscriptions.push(propertiesSubscription);
   // this.allSites = this.sites;
    console.log('getting allsites again');
    console.log(this.sites);
    setTimeout(() => {
      if (this.subunitSequence) {
        this.addStyle();
      }
    });
  }

    ngOnChanges(changes: SimpleChanges) {
    }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('AMINO_ACID_RESIDUE').subscribe(response => {
      this.vocabulary = response['AMINO_ACID_RESIDUE'].dictionary;
      this.processSubunits();
    }, error => {
      console.log(error);
      this.processSubunits();
    });
  }

  addStyle(): void {
    if (this.subunitSequence && this.subunitSequence.subunits) {
      this.allSites.forEach(site => {
        if (this.subunitSequence.subunits) {
          this.subunitSequence.subunits[site.residue - 1].class = site.type;
        } else {
        }
      });
    }

  }

  private processSubunits(): void {
    const subunitIndex = this.subunit.subunitIndex;
    this.subunit.sequence = this.subunit.sequence.trim().replace(/\s/g, '');
    const sequence = this.subunit.sequence.trim().replace(/\s/g, '');

    if (this.subunit.length !== this.subunit.sequence.length) {
      this.subunit.length = this.subunit.sequence.length;
    }
    const subunit = this.subunit.sequence.trim().replace(/\s/g, '');
      const subsections = [];
      let currentSections = [];
      for (let count = 0; count < subunit.length; count = count + 10) {

        if ((count + 10) >= subunit.length) {
          currentSections.push([count, subunit.length]);
          if ((count + 10) % 50 !== 0) {
            subsections.push(currentSections);
          }
        } else {
          currentSections.push([count, count + 10]);
        }
        if ((count + 10) % 50 === 0) {
          subsections.push(currentSections);
          currentSections = [];
        }
      }
      const thisTest: SubunitSequence =  {
        subunitIndex: subunitIndex,
        subunits: [],
        subsections: subsections,
        subgroups: currentSections
      };
      let index = 0;
      const indexEnd = subunit.length;
      while (index <= indexEnd) {
        if (subunit[index]) {
          const sequenceUnit: SequenceUnit = {
            unitIndex: index + 1,
            unitValue: subunit[index],
            class: ''
          };
          thisTest.subunits.push(sequenceUnit);
        }
        index++;
      }
      this.subunitSequence = thisTest;

    setTimeout(() => {this.addStyle(); });

  }

  getTooltipMessage(subunitIndex: number, unitIndex: number, unitValue: string): string {
    const vocab = (this.vocabulary[unitValue.toUpperCase()] === undefined ? 'UNDEFINED' : this.vocabulary[unitValue.toUpperCase()].display);
    return `${subunitIndex} - ${unitIndex}: ${unitValue.toUpperCase()} (${vocab})`;
  }

  editSubunit(subunit: Subunit, input: string): void {
    this.toggle[subunit.subunitIndex] = !this.toggle[subunit.subunitIndex];
    if (this.toggle[subunit.subunitIndex] === false) {
      this.subunit.sequence = input.trim().replace(/\s/g, '');
      this.substanceFormService.emitSubunitUpdate();
      this.substanceFormService.recalculateCysteine();
      this.processSubunits();
    } else {
      setTimeout(function () {
        const textArea = document.getElementsByClassName('sequence-textarea');
        [].forEach.call(textArea, function (area) {
           area.style.height = (area.scrollHeight + 10) + 'px';
          });
      });
    }
  }

  deleteSubunit(subunit: Subunit): void {
    this.substanceFormService.deleteSubstanceSubunit(subunit);
  }

  cleanSequence(): void {
    const valid = [];
    const test = this.subunit.sequence.split('');
    for (const key in this.vocabulary) {
      valid.push(this.vocabulary[key].value);
    }
    this.subunit.sequence =  test.filter(char => valid.indexOf(char.toUpperCase()) >= 0).toString().replace(/,/g, '').trim();

  }


}

interface SubunitSequence {
  subunitIndex?: number;
  subsections?: Array<any>;
  subgroups?: Array<any>;
  subunits?: Array<SequenceUnit>;
}

interface SequenceUnit {
  unitIndex: number;
  unitValue: string;
  class: string;
}

interface DisplaySite {
  type: string;
  subunit: number;
  residue: number;
}
