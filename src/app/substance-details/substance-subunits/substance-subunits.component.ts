import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import { Subunit } from '../../substance/substance.model';

@Component({
  selector: 'app-substance-subunits',
  templateUrl: './substance-subunits.component.html',
  styleUrls: ['./substance-subunits.component.scss']
})
export class SubstanceSubunitsComponent extends SubstanceCardBase implements OnInit {
  subunits: Array<Subunit> = [];
  subunitSequences: Array<SubunitSequence> = [];

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.substance != null
      && this.substance.protein != null
      && this.substance.protein.subunits != null
      && this.substance.protein.subunits.length) {

        this.subunits = this.substance.protein.subunits;

    }
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

  private addSequenceSectionsGroup(subunitSequence: SubunitSequence, squence: string = '', indexStart: number = 0, indexEnd: number = 49) {
    const indexIncrement = 50;
    if (squence.length > (indexStart + 1)) {
      const sequenceSectionGroup: SequenceSectionGroup = {
        sequenceSections: []
      };
      subunitSequence.sequencesSectionGroups.push(sequenceSectionGroup);
      
    }
  }

  private addSequenceSections(sequenceSectionString?: string, index: number = 0, indexEnd: number = 9) {
    const indexIncrement = 10;

    if (sequenceSectionString != null) {

      const sequenceSection: SequenceSection = {
        sectionNumber: 0,
        sectionUnits: []
      };

      while (index < indexEnd) {
        if (sequenceSectionString[index]) {
          sequenceSection.sectionNumber++;
          sequenceSection.sectionUnits.push(sequenceSectionString[index]);
          index++;
        } else {
          break;
        }
      }

      subunitSequence.sequencesSectionGroups.push(sequenceSection);

      if (sequenceStringSection.length > index) {
        indexEnd = indexEnd + indexIncrement;
        this.addSequenceSections(subunitSequence, sequenceStringSection, index, indexEnd);
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
  sectionUnits: Array<string>;
}
