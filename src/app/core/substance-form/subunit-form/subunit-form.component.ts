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
    this.allSites = [];
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const displaySequenceSubscription = this.substanceFormService.subunitDisplaySequences.subscribe(subunits => {
        this.subunitSequence = subunits.filter(unit => unit.subunitIndex === this.subunit.subunitIndex)[0];
      });
      this.subscriptions.push(displaySequenceSubscription);
    });

    const allSitesSubscription = this.substanceFormService.allSites.subscribe( allSites => {
          const tempSitelist = [];
          allSites.forEach(site => {
            if (site.subunit === this.subunit.subunitIndex){
              tempSitelist.push(site);
            }
          });
          if (this.allSites != tempSitelist){
            this.allSites = tempSitelist;
          }
      setTimeout(() => {
        if (this.subunitSequence) {
          this.addStyle();
        }
      });
      }
    );
    this.subscriptions.push(allSitesSubscription);
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
    }, error => {
    });
  }

  addStyle(): void {
    if (this.subunitSequence && this.subunitSequence.subunits) {

      this.allSites.forEach(site => {
        if (this.subunitSequence.subunits) {
          if (this.subunitSequence.subunits[site.residue - 1].class){
            this.subunitSequence.subunits[site.residue - 1].class = this.subunitSequence.subunits[site.residue - 1].class + ' ' + site.type;
          } else {
            this.subunitSequence.subunits[site.residue - 1].class = site.type;
          }
        } else {
        }
      });
    }
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
