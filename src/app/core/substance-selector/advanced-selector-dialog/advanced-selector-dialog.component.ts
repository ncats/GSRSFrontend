import { Component, OnInit, Input, Output, Inject } from '@angular/core';
import { Editor } from '@gsrs-core/structure-editor';
import * as _ from 'lodash';
import { ControlledVocabularyService, VocabularyTerm } from '@gsrs-core/controlled-vocabulary';
import { LoadingService } from '@gsrs-core/loading';
import { EventEmitter } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { StructureService, InterpretStructureResponse, StructureImageModalComponent } from '@gsrs-core/structure';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NavigationExtras, Router } from '@angular/router';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { FacetParam } from '@gsrs-core/facets-manager';
import { PageEvent } from '@angular/material/paginator';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { ConfigService } from '@gsrs-core/config';
@Component({
  selector: 'app-advanced-selector-dialog',
  templateUrl: './advanced-selector-dialog.component.html',
  styleUrls: ['./advanced-selector-dialog.component.scss']
})
export class AdvancedSelectorDialogComponent implements OnInit {

  private editor: Editor;
  connectivity: Array<any>;
  dat: any;
  domains: any;
  forms: Array<any> = [];
  term2: any = {value: '', display: ''};
  privateTerm: any = {value: '', display: ''};
  asDialog = false;
  vocabulary: any;
  message: string;
  validationMessages =[];
  adminPanel?: boolean;
  molfile: string;
  private privateFacetParams: FacetParam;
  showResults = false;
  totalSubstances = 0;
  pageIndex = 0;
  pageSize = 10;
  nameTotalSubstances = 0;
  namePageIndex = 0;
  namePageSize = 10;
  lastPage: number;
  searchValue: string;

  activeTab: number;
  current: string;
  lastTab: number;

smiles?: any;
searchType = 'substructure';
_searchtype: string;
similarityCutoff?: number;
showSimilarityCutoff = false;
substances?: Array<any>;
nameSubstances?: Array<any>;
nameResponse: any;
response: any;
private overlayContainer: HTMLElement;

private privateSearchTerm = '';
private privateStructureSearchTerm?: string;
private privateSequenceSearchTerm?: string;
private privateSearchType?: string;
private privateSearchCutoff?: number;
private privateSearchSeqType?: string;
private privateSequenceSearchKey?: string;


  constructor(
    private CVService: ControlledVocabularyService,
    private loadingService: LoadingService,
    private structureService: StructureService,
    private overlayContainerService: OverlayContainer,
    private substanceService: SubstanceService,
    private configService: ConfigService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AdvancedSelectorDialogComponent>,
    private router: Router,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dat = data;
    
  }
  


  get standardized(): boolean {
    return this.privateTerm;
  }

  close() {
    // this.dialogRef.close();
  }

  standardize(standard: string): void {
    const mol = this.editor.getMolfile();
    this.structureService.interpretStructure(mol, '', standard).subscribe((response: InterpretStructureResponse) => {
      if (response && response.structure && response.structure.molfile) {
        this.editor.setMolecule(response.structure.molfile);
      }
    }, () => {});
  }

  onTabChanged(event: any): void {
    
  }

  searchCutoffChanged(event): void {
    this.similarityCutoff = event.value;
  }

  nameSearch(event: any): void {
    this.searchValue = event;
    this.privateSearchTerm = event;
    this.privateStructureSearchTerm = null;
    this.searchSubstances(null, null, 'name');
  }

  ngOnInit(): void {  
    this.activeTab = this.data.tab;
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  
    if (this.privateTerm.simplifiedStructure) {
      this.privateTerm.simpleSrc = this.CVService.getStructureUrl(this.privateTerm.simplifiedStructure);
  }
  if (this.privateTerm.fragmentStructure) {
    this.privateTerm.fragmentSrc = this.CVService.getStructureUrl(this.privateTerm.fragmentStructure);
  }
  this.overlayContainer = this.overlayContainerService.getContainerElement();

  if(this.dat && this.dat.uuid) {
    this.structureService.getMolfile(this.dat.uuid);
  }

  if(this.dat && this.dat.name) {
    this.searchValue = this.dat.name;
  }

  }


  molvecUpdate(mol: any) {
    this.editor.setMolecule(mol);
  }

  

  editorOnLoad(editor: Editor): void {
    this.overlayContainer.style.zIndex = '1003';
  
      this.overlayContainer.style.zIndex = '10003';
    this.loadingService.setLoading(false);
    this.editor = editor;
    if(this.dat && this.dat.uuid) {
      this.structureService.getMolfile(this.data.uuid).subscribe( response => {
          this.editor.setMolecule(response);
          this.overlayContainer.style.zIndex = '1003';
  
      this.overlayContainer.style.zIndex = '10003';
          
        });
      }
    
    setTimeout(() => {
      // re-adjust z-index after editor messes it up
      this.overlayContainer.style.zIndex = '1003';
  
      this.overlayContainer.style.zIndex = '10003';
      }, 100);
  }

  getCombination(ll, i) {
    
  }

  search(): void {
    const mol = this.editor.getMolfile();
    this.structureService.interpretStructure(mol).subscribe((response: InterpretStructureResponse) => {
        this.response = response.structure.id;
        this.searchSubstances(response.structure.id, response.structure.smiles);
    }, () => {});
  }


  nameResolved(molfile: string): void {
    this.editor.setMolecule(molfile);
  }

  updateType(event: any) {
    this.searchType = event.value;
    
    this.privateSearchType = event.value;

    if (this.searchType === 'similarity') {
      this.showSimilarityCutoff = true;
      this.similarityCutoff = 0.8;
    } else {
      this.showSimilarityCutoff = false;
    }
  }

  navigateToBrowseSubstance(type: string, searchTerm?: string, smiles?: string): void {

    let navString = '';


    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };
  const navigationExtras2: NavigationExtras = {
      queryParams: {}
    };

    if (type === 'structure') {
      navigationExtras.queryParams['structure_search'] = this.privateStructureSearchTerm || null;
      navigationExtras.queryParams['type'] = this.searchType || null;
  
      navigationExtras2.queryParams['structure'] = this.privateStructureSearchTerm || null;
      navigationExtras2.queryParams['type'] = this.searchType || null;

      navString += '?structure=' + navigationExtras.queryParams['structure_search']
        + '&type=' + navigationExtras.queryParams['type'];
  
      if (this.searchType === 'similarity') {
        navigationExtras.queryParams['cutoff'] = this.similarityCutoff || 0;
        navString  += '&cutoff=' + navigationExtras.queryParams['cutoff'] ;
      }
  
      if (smiles != null) {
        navigationExtras.queryParams['smiles'] = smiles;
      }
   
       
       
  
    } else {
      navigationExtras.queryParams['search'] = this.searchValue;
      navString += '?search=' + navigationExtras.queryParams['search'];
    }

    this.dialogRef.close();
    let url = '';
    if (this.configService.configData && this.configService.configData.gsrsHomeBaseUrl) {
      url = this.configService.configData.gsrsHomeBaseUrl + '/browse-substance' + navString;
    } else {
      url = this.router.serializeUrl(
        this.router.createUrlTree(['/browse-substance'], {
          queryParams: navigationExtras.queryParams})
      );
    }
  
    window.open(url, '_blank');

   // this.router.navigate(['/browse-substance'], navigationExtras);
  }


  searchSubstances(structureSearchTerm?: string, smiles?: string, type?: string) {
    let size = this.pageSize;
    let index = this.pageIndex;
    if (structureSearchTerm){
      this.privateStructureSearchTerm = structureSearchTerm || null;
      this.privateSearchType = this.searchType || 'substructure';
  
      if (this.searchType === 'similarity') {
        this.privateSearchCutoff = this.similarityCutoff || 0;
      }


    } else {
      this.privateStructureSearchTerm = null;
      size = this.namePageSize;
      index = this.namePageIndex;
    }
   
      this.loadingService.setLoading(true);
      const subscription = this.substanceService.getSubstancesSummaries({
        searchTerm: this.privateSearchTerm,
        structureSearchTerm: this.privateStructureSearchTerm,
        sequenceSearchTerm: this.privateSequenceSearchTerm,
        cutoff: this.privateSearchCutoff,
        type: this.privateSearchType,
        seqType: this.privateSearchSeqType,
        order: null,
        pageSize: size,
        facets: this.privateFacetParams,
        skip: index,
        sequenceSearchKey: this.privateSequenceSearchKey,
        deprecated: false
      })
        .subscribe(pagingResponse => {
         // this.substances = (pagingResponse && pagingResponse.content) ? pagingResponse.content : [];

         // this.totalSubstances = pagingResponse.total;
          
          if(type && type === 'name') {
            this.nameSubstances = (pagingResponse && pagingResponse.content) ? pagingResponse.content : [];
            this.nameTotalSubstances = pagingResponse.total;
          } else {
            this.substances = (pagingResponse && pagingResponse.content) ? pagingResponse.content : [];
            this.totalSubstances = pagingResponse.total;
          }

          if (pagingResponse.total % this.pageSize === 0) {
            this.lastPage = (pagingResponse.total / this.pageSize);
          } else {
            this.lastPage = Math.floor(pagingResponse.total / this.pageSize + 1);
          }

          
          this.overlayContainer.style.zIndex = '1003';
        
            this.overlayContainer.style.zIndex = '10003';
          this.loadingService.setLoading(false);
        
            this.overlayContainer.style.zIndex = '10003';
          setTimeout(() => {
            // re-adjust z-index after editor messes it up
            this.overlayContainer.style.zIndex = '1003';
        
            this.overlayContainer.style.zIndex = '10003';
            });

        });

      }
  getPossibleSmiles(smi) {

    
  }

  fragmentType(domain: any, current?: any) {
  
  }

  getFragmentCV() {
   
    
  }
  checkImg(term: any) {
    term.fragmentSrc = this.CVService.getStructureUrlFragment(term.fragmentStructure);
    term.simpleSrc = this.CVService.getStructureUrlFragment(term.simplifiedStructure);

  }
  setTermStructure(structure) {
   
  }

  openImageModal(substance: SubstanceDetail): void {

    let data: any;
    let molfile: string;

    if (substance.substanceClass === 'chemical') {
      data = {
        structure: substance.uuid,
        smiles: substance.structure.smiles,
        uuid: substance.uuid,
        names: substance.names,
        component: 'selector'
      };
      molfile = substance.structure.molfile;
    } else {
      data = {
        structure: substance.uuid,
        names: substance.names,
        component: 'selector'
      };
      if (substance.polymer) {
        molfile = substance.polymer.idealizedStructure.molfile;
      } else {
        molfile = null;
      }
    }

    

    const dialogRef = this.dialog.open(StructureImageModalComponent, {
      width: '650px',
      panelClass: 'structure-image-panel',
      data: data
    });

    this.overlayContainer.style.zIndex = '1002';

    const subscription = dialogRef.afterClosed().subscribe(response => {
      if (response && response === 'molfile') {
        this.editor.setMolecule(molfile);
      }
      if (response && response === 'select') {
        this.selectSubstance(substance);

      }
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    }, () => {
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    });

  }

  selectSubstance(substance: SubstanceDetail) {
    this.dialogRef.close(substance);
  }

  changePage(pageEvent: PageEvent, type?: string) {
    if (type && type === 'name') {
      this.namePageSize = pageEvent.pageSize;
      this.namePageIndex = pageEvent.pageIndex;
        this.searchSubstances();
  
      

    } else {
      this.pageSize = pageEvent.pageSize;
      this.pageIndex = pageEvent.pageIndex;
        this.searchSubstances(this.response);
   
    }
    
  }
}

