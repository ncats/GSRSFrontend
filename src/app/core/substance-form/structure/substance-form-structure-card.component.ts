import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { SubstanceFormBase } from '../base-classes/substance-form-base';
import { Editor } from '../../structure-editor/structure.editor.model';
import { SubstanceStructure } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { StructureService } from '../../structure/structure.service';
import { LoadingService } from '../../loading/loading.service';
import { InterpretStructureResponse, StructureImportComponent, StructureImageModalComponent } from '@gsrs-core/structure';
import { MatDialog } from '@angular/material/dialog';
import { StructureExportComponent } from '@gsrs-core/structure/structure-export/structure-export.component';
import { OverlayContainer } from '@angular/cdk/overlay';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { StructureDuplicationMessage } from '../substance-form.model';
import { NameResolverDialogComponent } from '@gsrs-core/name-resolver/name-resolver-dialog.component';
import { Subscription } from 'rxjs';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { SubstanceFormStructuralUnitsService } from '../structural-units/substance-form-structural-units.service';
import { SubstanceFormStructureService } from './substance-form-structure.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { StructureEditorComponent } from '@gsrs-core/structure-editor';
import { take } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import { MatTableDataSource } from '@angular/material/table';

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
  features: Array<any>;
  isInitializing = true;
  private overlayContainer: HTMLElement;
  structureErrorsArray: Array<StructureDuplicationMessage>;
  subscriptions: Array<Subscription> = [];
  privateFeatures: any;
  enableStructureFeatures = false;
  sortedFeatures = new MatTableDataSource();
  displayedColumns = ['key', 'value'];
  featuresOnly = false;
  hideFeaturesTable = false;
  structureEditSearch = true;
  StructureFeaturePriority = [
    'Category Score',
    'Sum Of Scores',
    'AI Limit (US)',
    'Potency Category',
    'Potency Score',
    'type',
    'Type',
    'TYPE'
  ];
  @ViewChild(StructureEditorComponent) structureEditorComponent!: StructureEditorComponent;

  constructor(
    private substanceFormService: SubstanceFormService,
    private substanceFormStructureService: SubstanceFormStructureService,
    private structureService: StructureService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
    private gaService: GoogleAnalyticsService,
    private substanceService: SubstanceService,
    private substanceFormStructuralUnitsService: SubstanceFormStructuralUnitsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private configService: ConfigService
  ) {
    super();
  }

  ngOnInit() {
    if (this.configService.configData && this.configService.configData.enableStructureFeatures) {
      this.enableStructureFeatures = this.configService.configData.enableStructureFeatures;
    }

    if (this.configService.configData && 
      (this.configService.configData.structureEditSearch !== undefined && 
        this.configService.configData.structureEditSearch !== null)) {
      this.structureEditSearch = this.configService.configData.structureEditSearch;
    }

    if (this.configService.configData && 
      (this.configService.configData.StructureFeaturePriority !== undefined && 
        this.configService.configData.StructureFeaturePriority !== null)) {
      this.StructureFeaturePriority = this.configService.configData.StructureFeaturePriority;
    }
    
    if(this.activatedRoute.snapshot.routeConfig.path === 'structure-features') {
      this.featuresOnly = true;
    }
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
      this.updateStructureForm(molfile);
      this.smiles = this.structure && this.structure.smiles || null;
      this.mol = this.structure && this.structure.molfile || null;
    });
    this.isInitializing = false;
  }

  startInitializing(): void {
    this.isInitializing = true;
  }

  endInitializing(): void {
    this.isInitializing = false;
  }

  changeEditor(event: any) {
    if (this.structure && this.structureEditor && this.structure.molfile) {
     // this.loadStructure();
    }
  }

  loadStructure(): void {
    if (this.structure && this.structureEditor && this.structure.molfile) {
      this.isInitializing = true;
      this.structureEditor.setMolecule(this.structure.molfile);
      this.smiles = this.structure.smiles;
      this.mol = this.structure.molfile;
           // imported structures from search results require a second structure refresh to display stereochemistry and other calculated fields
     if ( this.activatedRoute && this.activatedRoute.snapshot.queryParams && this.activatedRoute.snapshot.queryParams['importStructure']) {
      setTimeout(()=>{
        this.updateStructureForm(this.structure.molfile), 1000
      });
     }
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
        this.structure.molfile = molfile;
        this.smiles = response.structure.smiles;

      });
    }
  }

   featureSort(a: any, b: any): number {
    const indexA = this.StructureFeaturePriority.indexOf(a.key);
    const indexB =  this.StructureFeaturePriority.indexOf(b.key);
  

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    } else if (indexA !== -1) {
      return -1; // a comes first
    } else if (indexB !== -1) {
      return 1; // b comes first
    } else {
      return a.key.localeCompare(b.key);
    }
  }

  processStructurePostResponse(structurePostResponse?: InterpretStructureResponse): void {
    if (structurePostResponse && structurePostResponse.structure) {
      let customSort = (array: any[]): any[] => {
        return array.sort((a, b) => {
          return this.featureSort(a, b);
        });
      };

      if (structurePostResponse.featureList) {
        this.hideFeaturesTable = false;
        let tempArr = [];
        let emptyFeatures = true;
        if (JSON. stringify(structurePostResponse.featureList) !== '{}'){

        Object.keys(structurePostResponse.featureList).forEach(type => {
          let tempObj = {'label':null, 'features': null};

          tempObj.label = (type.charAt(0).toUpperCase() + type.slice(1)).replace(/([A-Z])/g, ' $1').trim();
          let temp = [];

          if(structurePostResponse.featureList[type].length > 0) {
            emptyFeatures = false;
            Object.keys(structurePostResponse.featureList[type][0]).forEach(key => {
              let label = key;
              if(key === 'categoryScore'){
                label = 'Category Score';
              }
              if(key === 'sumOfScores'){
                label = 'Sum Of Scores';
              }
              if (key.toLowerCase() === 'type') {
                label = 'Type';
              }
              temp.push({'key': label,'value': structurePostResponse.featureList[type][0][key] });
            });
          }
          tempObj.features = new MatTableDataSource(customSort(temp));
          tempArr.push(tempObj);
        });
        this.features = tempArr;
        if (emptyFeatures) {
          this.hideFeaturesTable = true;
        }
      } else {
        this.hideFeaturesTable = true;
      }
      } 

      // we should only be dealing with this stuff if the total hash changes
      // or if the charge changes, or if it's a polymer
      if (this.substanceType === 'polymer' ||
        this.structure['hash'] !== structurePostResponse.structure['hash'] ||
        this.structure['charge'] !== structurePostResponse.structure['charge']) {
        this.smiles = structurePostResponse.structure.smiles;
        this.mol = structurePostResponse.structure.molfile;
        // this is sometimes overly ambitious
        Object.keys(structurePostResponse.structure).forEach(key => {
          // we don't want to do this with molfile, we want to trust the editor
          if (key !== 'molfile') {
            this.structure[key] = structurePostResponse.structure[key];
          }
        });

        this.structure.uuid = '';
        this.substanceFormStructureService.updateMoieties(structurePostResponse.moieties);
        if (this.substanceType !== 'polymer') {
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
          this.structureEditorComponent.setMolecule(response.structure.molfile);
        }
        this.processStructurePostResponse(response);
      }
    }, () => { });
  }

  generateSRU(): void {
    this.loadingService.setLoading(true);
    this.structureService.interpretStructure(this.structure.molfile).subscribe(response => {
      if (response.structuralUnits && response.structuralUnits.length > 0) {
        this.substanceFormStructuralUnitsService.updateSRUs(response.structuralUnits);
      }
      this.loadingService.setLoading(false);
    }, error => {
      this.loadingService.setLoading(false);
    });
  }

  openStructureExportDialog(): void {
    this.structureEditor.getSmiles().pipe(take(1)).subscribe(resp => {
    const dialogRef = this.dialog.open(StructureExportComponent, {
      height: 'auto',
      width: '650px',
      data: {
        molfile: this.mol,
        smiles: resp,
        type: this.substanceType
      }
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(() => {
      this.overlayContainer.style.zIndex = null;
    }, () => {
      this.overlayContainer.style.zIndex = null;
    });
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
        this.structureEditorComponent.setMolecule(molfile);
      }
    }, () => { });
  }

  loadForm():void {
    this.structureEditor.getSmiles().pipe(take(1)).subscribe(smiles => {

    const navigationExtras: NavigationExtras = {
      queryParams: {
        importStructure: encodeURIComponent(smiles)
      }
    };
    this.router.navigate(['/substances/register/chemical'], navigationExtras);
  });

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
    this.substanceFormService.structureDuplicateCheck().subscribe(response => {
      response.forEach(resp => {
        if (resp.messageType && resp.messageType !== 'INFO') {
          this.structureErrorsArray.push(resp);
        }
      });
    });
  }

  structureSearch() {
    this.loadingService.setLoading(true);

    this.structureService.interpretStructure(this.structure.molfile).subscribe(response => {
      this.loadingService.setLoading(false);
      const navigationExtras: NavigationExtras = {
        queryParams: {
          structure: response.structure.id
        }
      };
      if (this.configService.configData && this.configService.configData.gsrsHomeBaseUrl) {
        let url = this.configService.configData.gsrsHomeBaseUrl + '/structure-search?structure=' + response.structure.id;
        window.open(url, '_blank');
      } else {
        const baseUrl = window.location.href.replace(this.router.url, '');
        const url = baseUrl + this.router.serializeUrl(this.router.createUrlTree(['/structure-search'],
        { queryParams: navigationExtras.queryParams}));
        window.open( url, '_blank');
      }
    }, error => {
      this.loadingService.setLoading(false);
    });
  }

  dismissErrorMessage(index: number) {
    this.structureErrorsArray.splice(index, 1);
  }

  fixLink(link: string) {
    return this.substanceService.oldLinkFix(link);
  }
}
