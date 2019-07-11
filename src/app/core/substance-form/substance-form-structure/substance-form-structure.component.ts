import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { Editor } from '../../structure-editor/structure.editor.model';
import { SubstanceStructure } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { StructureService } from '../../structure/structure.service';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { FormControl, Validators } from '@angular/forms';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';

@Component({
  selector: 'app-substance-form-structure',
  templateUrl: './substance-form-structure.component.html',
  styleUrls: ['./substance-form-structure.component.scss']
})
export class SubstanceFormStructureComponent extends SubstanceFormSectionBase implements OnInit, AfterViewInit {
  structureEditor: Editor;
  structure: SubstanceStructure;
  molFormulaControl = new FormControl('', [Validators.required]);
  stereoChemistryTypeList: Array<VocabularyTerm> = [];
  stereochemistryControl = new FormControl('');
  opticalActivityList: Array<VocabularyTerm> = [];
  opticalActivityControl = new FormControl('');
  atropisomerismList: Array<VocabularyTerm> = [];
  atropisomerismControl = new FormControl('');

  constructor(
    private substanceFormService: SubstanceFormService,
    private structureService: StructureService,
    private cvService: ControlledVocabularyService
  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Structure');
    this.substanceFormService.substanceStructure.subscribe(structure => {
      this.structure = structure;
      this.loadStructure();
      this.molFormulaControl.setValue(this.structure.formula);
      this.molFormulaControl.valueChanges.subscribe(value => {
        this.structure.formula = value;
      });
      this.stereochemistryControl.setValue(this.structure.stereochemistry);
      this.stereochemistryControl.valueChanges.subscribe(value => {
        this.structure.stereochemistry = value;
      });
      this.opticalActivityControl.setValue(this.structure.opticalActivity);
      this.opticalActivityControl.valueChanges.subscribe(value => {
        this.structure.opticalActivity = value;
      });
      this.atropisomerismControl.setValue(this.structure.atropisomerism);
      this.atropisomerismControl.valueChanges.subscribe(value => {
        this.structure.atropisomerism = value;
      });
    });
    this.getVocabularies();
  }

  ngAfterViewInit() {
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('STEREOCHEMISTRY_TYPE', 'OPTICAL_ACTIVITY', 'ATROPISOMERISM').subscribe(response => {
      this.stereoChemistryTypeList = response['STEREOCHEMISTRY_TYPE'].list;
      this.opticalActivityList = response['OPTICAL_ACTIVITY'].list;
      this.atropisomerismList = response['ATROPISOMERISM'].list;
    });
  }

  editorOnLoad(editor: Editor): void {
    this.structureEditor = editor;
    this.loadStructure();
    this.structureEditor.structureUpdated().subscribe(molfile => {
      this.updateStructureForm(molfile);
    });
  }

  loadStructure(): void {
    if (this.structure && this.structureEditor && this.structure.molfile) {
      this.structureEditor.setMolecule(this.structure.molfile);
    }
  }

  updateStructureForm(molfile: string): void {
    this.structureService.postStructure(molfile).subscribe(response => {
      if (response.structure) {

        Object.keys(response.structure).forEach(key => {
          this.structure[key] = response.structure[key];
        });

        this.substanceFormService.updateMoieties(response.moieties);
        this.molFormulaControl.setValue(this.structure.formula);
        this.stereochemistryControl.setValue(this.structure.stereochemistry);
        this.opticalActivityControl.setValue(this.structure.opticalActivity);
        this.atropisomerismControl.setValue(this.structure.atropisomerism);
      }
    });
  }

  updateAccess(access: Array<string>): void {
    this.structure.access = access;
  }

}
