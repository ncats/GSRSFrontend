import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { Editor } from '../../structure-editor/structure.editor.model';
import { SubstanceStructure } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { StructureService } from '../../structure/structure.service';

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
    private structureService: StructureService
  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Structure');
    this.substanceFormService.substanceStructure.subscribe(structure => {
      this.structure = structure;
      this.loadStructure();
    });
  }

  ngAfterViewInit() {
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

        this.structure.uuid = '';

        this.substanceFormService.updateMoieties(response.moieties);
      }
    });
  }

}
