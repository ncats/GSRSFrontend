import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormBase } from '../substance-form-base';
import { Editor } from '../../structure-editor/structure.editor.model';
import { SubstanceStructure } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { StructureService } from '../../structure/structure.service';
import { LoadingService } from '../../loading/loading.service';
import { StructurePostResponse } from '@gsrs-core/structure';

@Component({
  selector: 'app-substance-form-structure',
  templateUrl: './substance-form-structure.component.html',
  styleUrls: ['./substance-form-structure.component.scss']
})
export class SubstanceFormStructureComponent extends SubstanceFormBase implements OnInit, AfterViewInit {
  structureEditor: Editor;
  structure: SubstanceStructure;
  userMessage: string;
  userMessageTimer: any;
  substanceType: string;
  anchorElement: HTMLAnchorElement;
  smiles: string;
  mol: string;

  constructor(
    private substanceFormService: SubstanceFormService,
    private structureService: StructureService,
    private loadingService: LoadingService
  ) {
    super();
  }

  ngOnInit() {
    this.anchorElement = document.createElement('a') as HTMLAnchorElement;
    this.substanceFormService.definition.subscribe(def => {
      this.substanceType = def.substanceClass;
      if (this.substanceType === 'polymer') {
        this.menuLabelUpdate.emit('Idealized Structure');
        this.substanceFormService.substanceDisplayStructure.subscribe(structure => {
          if (structure) {
            this.structure = structure;
          } else {
            this.substanceFormService.substanceIdealizedStructure.subscribe(structure => {
              this.structure = structure;
            });
          }
          this.loadStructure();
        });
      } else {
        this.menuLabelUpdate.emit('Structure');
        this.substanceFormService.substanceStructure.subscribe(structure => {
          this.structure = structure;
          this.loadStructure();
        });
      }
    });

  }

  ngAfterViewInit() {

  }

  editorOnLoad(editor: Editor): void {
    this.loadingService.setLoading(false);
    this.structureEditor = editor;
    this.loadStructure();
    this.structureEditor.structureUpdated().subscribe(molfile => {
      this.smiles = null;
      this.mol = null;
      this.updateStructureForm(molfile);
    });
  }

  loadStructure(): void {
    if (this.structure && this.structureEditor && this.structure.molfile) {
      this.structureEditor.setMolecule(this.structure.molfile);
    }
  }

  molvecUpdate(mol: any): void {
    this.updateStructureForm(mol);
    this.structureEditor.setMolecule(mol);
  }

  updateStructureForm(molfile: string): void {
    this.structureService.postStructure(molfile).subscribe(response => {
      this.processStructurePostResponse(response);
    });
  }

  processStructurePostResponse(structurePostResponse?: StructurePostResponse): void {
    if (structurePostResponse && structurePostResponse.structure) {
      this.smiles = structurePostResponse.structure.smiles;
      this.mol = structurePostResponse.structure.molfile;
      Object.keys(structurePostResponse.structure).forEach(key => {
        this.structure[key] = structurePostResponse.structure[key];
      });

      this.structure.uuid = '';
      this.substanceFormService.updateMoieties(structurePostResponse.moieties);

      if (structurePostResponse.moieties && structurePostResponse.moieties.length > 1) {
        clearTimeout(this.userMessageTimer);

        this.userMessage = 'Certain moieties may have been updated and/or deleted. Please check that the changes are correct.';

        this.userMessageTimer = setTimeout(() => {
          this.userMessage = null;
        }, 8000);
      }
    }
  }



  structureImported(structurePostResponse?: StructurePostResponse): void {
    if (structurePostResponse && structurePostResponse.structure && structurePostResponse.structure.molfile) {
      this.structureEditor.setMolecule(structurePostResponse.structure.molfile);
    }
    this.processStructurePostResponse(structurePostResponse);
  }

  nameResolved(molfile: string): void {
    this.updateStructureForm(molfile);
    this.structureEditor.setMolecule(molfile);
  }

  generateSRU(): void {
    this.structureService.postStructure(this.structure.molfile).subscribe(response => {
      if (response.structuralUnits && response.structuralUnits.length > 0) {
        this.substanceFormService.updateSRUs(response.structuralUnits);
      }
    });
  }

  download(type: 'mol'|'smiles'): void {
    if (type === 'mol') {
      this.downloadMol();
    } else {
      this.downloadSmiles();
    }
  }

  private downloadMol(): void {
    if (this.mol != null) {
      const file = new Blob([this.mol], { type: 'chemical/x-mdl-molfile'});
      this.anchorElement.download = 'substance_structure.mol';
      this.downloadFile(file);
    }
  }

  private downloadSmiles(): void {
    if (this.smiles != null) {
      const file = new Blob([this.smiles], { type: 'text/plain'});
      this.anchorElement.download = 'substance_smiles.txt';
      this.downloadFile(file);
    }
  }

  private downloadFile(file: Blob): void {
    this.anchorElement.href = window.URL.createObjectURL(file);
    this.anchorElement.click();
  }
}
