import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormBase } from '../substance-form-base';
import { Editor } from '../../structure-editor/structure.editor.model';
import { SubstanceStructure } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { StructureService } from '../../structure/structure.service';
import { LoadingService } from '../../loading/loading.service';
import { StructurePostResponse } from '@gsrs-core/structure';
import { MatDialog } from '@angular/material';
import { StructureExportComponent } from '@gsrs-core/structure/structure-export/structure-export.component';
import { OverlayContainer } from '@angular/cdk/overlay';

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
  smiles: string;
  mol: string;
  isInitializing = true;
  private overlayContainer: HTMLElement;

  constructor(
    private substanceFormService: SubstanceFormService,
    private structureService: StructureService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer
  ) {
    super();
  }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.substanceFormService.definition.subscribe(def => {
      this.substanceType = def.substanceClass;
      if (this.substanceType === 'polymer') {
        this.menuLabelUpdate.emit('Idealized Structure');
        this.substanceFormService.substanceIdealizedStructure.subscribe(structure => {
          if (structure) {
            this.structure = structure;
          } else {
            // while we also want to do something with display structures eventually,
            // this isn't the place to do it, I don't think ...
            //
            // this.substanceFormService.substanceDisplayStructure.subscribe(structure2 => {
            //   this.structure = structure2;
            // });
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
    this.isInitializing = false;
  }

  startInitializing(): void {
    this.isInitializing = true;
  }

  endInitializing(): void {
    this.isInitializing = false;
  }

  loadStructure(): void {
    if (this.structure && this.structureEditor && this.structure.molfile) {
      this.isInitializing = true;
      this.structureEditor.setMolecule(this.structure.molfile);
      this.smiles = this.structure.smiles;
      this.mol = this.structure.molfile;
      this.isInitializing = false;
    }
  }

  molvecUpdate(mol: any): void {
    this.updateStructureForm(mol);
    this.structureEditor.setMolecule(mol);
  }

  updateStructureForm(molfile: string): void {
    if (!this.isInitializing) {
      this.structureService.postStructure(molfile).subscribe(response => {
        this.processStructurePostResponse(response);
      });
    }
  }

  processStructurePostResponse(structurePostResponse?: StructurePostResponse): void {
    if (structurePostResponse && structurePostResponse.structure) {

      // we should only be dealing with this stuff if the total hash changes
      if (this.structure['hash'] !== structurePostResponse.structure['hash']) {
         this.smiles = structurePostResponse.structure.smiles;
         this.mol = structurePostResponse.structure.molfile;

         // this is sometimes overly ambitious
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
           }, 20000);
         }
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

  openStructureExportDialog(): void {
    const dialogRef = this.dialog.open(StructureExportComponent, {
      height: 'auto',
      width: '650px',
      data: {
        molfile: this.mol,
        smiles: this.smiles
      }
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(() => {
      this.overlayContainer.style.zIndex = null;
    }, () => {
      this.overlayContainer.style.zIndex = null;
    });
  }
}
