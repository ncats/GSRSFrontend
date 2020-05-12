import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceFormBase } from '../base-classes/substance-form-base';
import { Editor } from '../../structure-editor/structure.editor.model';
import { SubstanceStructure } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { StructureService } from '../../structure/structure.service';
import { LoadingService } from '../../loading/loading.service';
import { InterpretStructureResponse, StructureImportComponent, StructureImageModalComponent } from '@gsrs-core/structure';
import { MatDialog } from '@angular/material';
import { StructureExportComponent } from '@gsrs-core/structure/structure-export/structure-export.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { StructureDuplicationMessage } from '../substance-form.model';
import { NameResolverDialogComponent } from '@gsrs-core/name-resolver/name-resolver-dialog.component';
import { Subscription } from 'rxjs';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { SubstanceFormStructuralUnitsService } from '../structural-units/substance-form-structural-units.service';
import { SubstanceFormStructureService } from './substance-form-structure.service';

@Component({
  selector: 'app-substance-form-structure-card',
  templateUrl: './substance-form-structure-card.component.html',
  styleUrls: ['./substance-form-structure-card.component.scss']
})
export class SubstanceFormStructureCardComponent extends SubstanceFormBase implements OnInit, AfterViewInit, OnDestroy {
  structureEditor: Editor;
  structure: SubstanceStructure;
  userMessage: string;
  userMessageTimer: any;
  substanceType: string;
  smiles: string;
  mol: string;
  isInitializing = true;
  private overlayContainer: HTMLElement;
  structureErrorsArray: Array<StructureDuplicationMessage>;
  subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    private substanceFormStructureService: SubstanceFormStructureService,
    private structureService: StructureService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
    private gaService: GoogleAnalyticsService,
    private substanceService: SubstanceService,
    private substanceFormStructuralUnitsService: SubstanceFormStructuralUnitsService
  ) {
    super();
  }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    const definitionSubscription = this.substanceFormService.definition.subscribe(def => {
      this.substanceType = def.substanceClass;
      if (this.substanceType === 'polymer') {
        this.menuLabelUpdate.emit('Idealized Structure');
        const idealStructSubscription = this.substanceFormStructureService.substanceIdealizedStructure.subscribe(structure => {
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
        this.subscriptions.push(idealStructSubscription);
      } else {
        this.menuLabelUpdate.emit('Structure');
        const structSubscription = this.substanceFormStructureService.substanceStructure.subscribe(structure => {
          this.structure = structure;
          this.loadStructure();
        });
        this.subscriptions.push(structSubscription);
      }
    });
    this.subscriptions.push(definitionSubscription);
    const resolver = this.substanceFormService.resolvedMol.subscribe(mol => {
      if (mol != null && mol !== '') {
        this.updateStructureForm(mol);
        this.structureEditor.setMolecule(mol);
      }
    });
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
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
      this.structure.molfile = molfile;
      this.structureService.interpretStructure(molfile).subscribe(response => {
        this.processStructurePostResponse(response);
      });
    }
  }

  processStructurePostResponse(structurePostResponse?: InterpretStructureResponse): void {
    if (structurePostResponse && structurePostResponse.structure) {

      // we should only be dealing with this stuff if the total hash changes
      // or if the charge changes, or if it's a polymer
      if (this.substanceType === 'polymer' ||
          this.structure['hash'] !== structurePostResponse.structure['hash'] ||
          this.structure['charge'] !== structurePostResponse.structure['charge']) {
         this.smiles = structurePostResponse.structure.smiles;
         this.mol = structurePostResponse.structure.molfile;

         // this is sometimes overly ambitious
         Object.keys(structurePostResponse.structure).forEach(key => {
           //we don't want to do this with molfile, we want to trust the editor
           if(key!=="molfile"){
              this.structure[key] = structurePostResponse.structure[key];
           }
         });

         this.structure.uuid = '';
         this.substanceFormStructureService.updateMoieties(structurePostResponse.moieties);

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

  openStructureImportDialog(): void {
    this.gaService.sendEvent('structureForm', 'button:import', 'import structure');
    const dialogRef = this.dialog.open(StructureImportComponent, {
      height: 'auto',
      width: '650px',
      data: {}
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe((response?: InterpretStructureResponse) => {
      this.overlayContainer.style.zIndex = null;
      if (response != null) {
        if (response && response.structure && response.structure.molfile) {
          this.structureEditor.setMolecule(response.structure.molfile);
        }
        this.processStructurePostResponse(response);
      }
    }, () => {});
  }

  generateSRU(): void {
    this.structureService.interpretStructure(this.structure.molfile).subscribe(response => {
      if (response.structuralUnits && response.structuralUnits.length > 0) {
        this.substanceFormStructuralUnitsService.updateSRUs(response.structuralUnits);
      }
    });
  }

  openStructureExportDialog(): void {
    const dialogRef = this.dialog.open(StructureExportComponent, {
      height: 'auto',
      width: '650px',
      data: {
        molfile: this.mol,
        smiles: this.smiles,
        type: this.substanceType
      }
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(() => {
      this.overlayContainer.style.zIndex = null;
    }, () => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  openNameResolverDialog(): void {
    this.gaService.sendEvent('structureForm', 'button:resolveName', 'resolve name');
    const dialogRef = this.dialog.open(NameResolverDialogComponent, {
      height: 'auto',
      width: '800px',
      data: {}
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe((molfile?: string) => {
      this.overlayContainer.style.zIndex = null;
      if (molfile != null && molfile !== '') {
        this.updateStructureForm(molfile);
        this.structureEditor.setMolecule(molfile);
      }
    }, () => {});
  }

  openStructureImageModal(): void {

    const dialogRef = this.dialog.open(StructureImageModalComponent, {
      height: '90%',
      width: '650px',
      panelClass: 'structure-image-panel',
      data: {
        structure: this.structure.id
      }
    });

    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(() => {
      this.overlayContainer.style.zIndex = null;
    }, () => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  duplicateCheck() {
    this.structureErrorsArray = [];
    this.substanceFormService.structureDuplicateCheck().subscribe (response => {
      response.forEach(resp => {
        if (resp.messageType && resp.messageType !== 'INFO') {
          this.structureErrorsArray.push(resp);
        }
      });
    });
  }

  dismissErrorMessage(index: number) {
    this.structureErrorsArray.splice(index, 1);
  }

  fixLink(link: string) {
    return this.substanceService.oldLinkFix(link);
  }
}
