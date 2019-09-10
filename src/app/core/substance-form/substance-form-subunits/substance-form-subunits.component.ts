import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import { Subunit} from '@gsrs-core/substance';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';

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

  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    private cvService: ControlledVocabularyService,
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form subunits';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Subunits');
  }

  ngAfterViewInit(): void {
    const subunitsSubscription = this.substanceFormService.substanceSubunits.subscribe(subunits => {
      this.subunits = subunits;
      this.filtered = subunits;
      this.subscriptions.push(namesSubscription);
  });
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
      this.processSubunits();
    });
  }

  private processSubunits(): void {
    this.subunits.forEach(subunit => {
      const subunitSequence: SubunitSequence = {
        subunitIndex: subunit.subunitIndex,
        sequencesSectionGroups: []
      };
      this.subunitSequences.push(subunitSequence);
      this.addSequenceSectionsGroup(subunitSequence, subunit.sequence);
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
            unitValue: sequenceSectionString[index]
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
}
