import { Component, OnInit, Input } from '@angular/core';
import { SubstanceMoiety, SubstanceStructure } from '@gsrs-core/substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-structure-form',
  templateUrl: './structure-form.component.html',
  styleUrls: ['./structure-form.component.scss']
})
export class StructureFormComponent implements OnInit {
  private privateStructure: SubstanceStructure | SubstanceMoiety = {};
  molFormulaControl = new FormControl('', [Validators.required]);
  stereoChemistryTypeList: Array<VocabularyTerm> = [];
  stereochemistryControl = new FormControl('');
  opticalActivityList: Array<VocabularyTerm> = [];
  opticalActivityControl = new FormControl('');
  atropisomerismList: Array<VocabularyTerm> = [];
  atropisomerismControl = new FormControl('');
  stereoCommentsControl = new FormControl('');
  @Input() hideAccess = false;

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  @Input()
  set structure(structure: SubstanceStructure | SubstanceMoiety) {
    if (structure != null) {
      this.privateStructure = structure;

      this.molFormulaControl.setValue(this.privateStructure.formula);
      this.molFormulaControl.valueChanges.subscribe(value => {
        this.privateStructure.formula = value;
      });
      this.stereochemistryControl.setValue(this.privateStructure.stereochemistry);
      this.stereochemistryControl.valueChanges.subscribe(value => {
        this.privateStructure.stereochemistry = value;
      });
      this.opticalActivityControl.setValue(this.privateStructure.opticalActivity);
      this.opticalActivityControl.valueChanges.subscribe(value => {
        this.privateStructure.opticalActivity = value;
      });
      this.atropisomerismControl.setValue(this.privateStructure.atropisomerism);
      this.atropisomerismControl.valueChanges.subscribe(value => {
        this.privateStructure.atropisomerism = value;
      });
      this.stereoCommentsControl.setValue(this.privateStructure.stereoComments);
      this.stereoCommentsControl.valueChanges.subscribe(value => {
        this.privateStructure.stereoComments = value;
      });
    }
  }

  get structure(): (SubstanceStructure | SubstanceMoiety) {
    return this.privateStructure;
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('STEREOCHEMISTRY_TYPE', 'OPTICAL_ACTIVITY', 'ATROPISOMERISM').subscribe(response => {
      this.stereoChemistryTypeList = response['STEREOCHEMISTRY_TYPE'].list;
      this.opticalActivityList = response['OPTICAL_ACTIVITY'].list;
      this.atropisomerismList = response['ATROPISOMERISM'].list;
    });
  }

  updateAccess(access: Array<string>): void {
    this.privateStructure.access = access;
  }

}
