import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { Editor } from '../../structure-editor/structure.editor.model';
import { SubstanceStructure, SubstanceMoiety } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { StructureService } from '../../structure/structure.service';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';

@Component({
  selector: 'app-substance-form-structure',
  templateUrl: './substance-form-structure.component.html',
  styleUrls: ['./substance-form-structure.component.scss']
})
export class SubstanceFormStructureComponent extends SubstanceFormSectionBase implements OnInit, AfterViewInit {
  structureEditor: Editor;
  structure: SubstanceStructure;

  constructor(
    private substanceFormService: SubstanceFormService,
    private structureService: StructureService,
    private cvService: ControlledVocabularyService
  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Structure');
  }

  ngAfterViewInit() {
    this.substanceFormService.substanceStructure.subscribe(structure => {
      this.structure = structure;
      this.loadStructure();
    });
  }

  editorOnLoad(editor: Editor): void {
    this.structureEditor = editor;
    this.loadStructure();
    this.structureEditor.structureUpdated().subscribe(molfile => {
      this.updateMolServer(molfile);
    });
  }

  loadStructure(): void {
    if (this.structure && this.structureEditor && this.structure.molfile) {
      this.structureEditor.setMolecule(this.structure.molfile);
    }
  }

  updateMolServer(molfile: string): void {
    this.structureService.postStructure(molfile).subscribe(response => {
      if (response.structure) {

        if (this.structure.id) {
          response.structure.id = this.structure.id;
        }

        this.structureService.mergeStructures(this.structure, response.structure);

        if (response.structure.hash !== this.structure.hash) {

        }
      }
    });
  }

}
