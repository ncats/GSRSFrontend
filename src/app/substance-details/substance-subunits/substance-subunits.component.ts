import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import { Subunit } from '../../substance/substance.model';
import { UtilsService } from '../../utils/utils.service';
import { VocabularyTerm } from '../../utils/vocabulary.model';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';

@Component({
  selector: 'app-substance-subunits',
  templateUrl: './substance-subunits.component.html',
  styleUrls: ['./substance-subunits.component.scss']
})
export class SubstanceSubunitsComponent extends SubstanceCardBase implements OnInit {
  subunits: Array<Subunit> = [];
  subunitSequences: Array<SubunitSequence> = [];
  vocabulary: { [vocabularyTermValue: string]: VocabularyTerm } = {};
  view = 'details';

  constructor(
    private utilsService: UtilsService,
    public gaService: GoogleAnalyticsService
  ) {
    super();
  }

  ngOnInit() {
    if (this.substance != null
      && this.substance.protein != null
      && this.substance.protein.subunits != null
      && this.substance.protein.subunits.length) {
        this.subunits = this.substance.protein.subunits;
        this.getVocabularies();
    }
  }

  getVocabularies(): void {
    this.utilsService.getDomainVocabulary('AMINO_ACID_RESIDUE').subscribe(response => {
      this.vocabulary = response;
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

  getTooltipMessage(subunitIndex: number, unitIndex: number, unitValue: string): string {
    return `${subunitIndex} - ${unitIndex}: ${unitValue} (${this.vocabulary[unitValue].display})`;
  }

  updateView(event): void {
    this.gaService.sendEvent(this.analyticsEventCategory, 'button:view-update', event.value);
    this.view = event.value;
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
