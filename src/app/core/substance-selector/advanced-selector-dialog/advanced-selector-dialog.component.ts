import { Component, OnInit, Inject } from '@angular/core';
import { Editor } from '@gsrs-core/structure-editor';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { LoadingService } from '@gsrs-core/loading';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { StructureService, InterpretStructureResponse, StructureImageModalComponent, StructureImportComponent } from '@gsrs-core/structure';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NavigationExtras, Router } from '@angular/router';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { FacetParam } from '@gsrs-core/facets-manager';
import { PageEvent } from '@angular/material/paginator';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { ConfigService } from '@gsrs-core/config';
import { StructureExportComponent } from '@gsrs-core/structure/structure-export/structure-export.component';
import { searchSortValues } from '@gsrs-core/utils';
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
  nameSearched = false;
  structureSearched = false;

  loading = false;
  order = "default";
  public sortValues = searchSortValues;

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

panelOpenState = true;
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
     this.dialogRef.close();
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
    this.activeTab = event.index;
  }

  searchCutoffChanged(event): void {
    this.similarityCutoff = event.value;
  }

  nameSearch(event: any): void {
    this.searchValue = event;
    this.privateSearchTerm = event;
    this.privateStructureSearchTerm = null;
    this.nameSearched = true;
    this.namePageIndex = 0;
    this.searchSubstances(null, null, 'name');
  }

  reSort() {
    this.searchSubstances(null, null, 'name');
  }

  ngOnInit(): void {  
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  
    if (this.privateTerm.simplifiedStructure) {
      this.privateTerm.simpleSrc = this.CVService.getStructureUrl(this.privateTerm.simplifiedStructure);
  }
  if (this.privateTerm.fragmentStructure) {
    this.privateTerm.fragmentSrc = this.CVService.getStructureUrl(this.privateTerm.fragmentStructure);
  }
  this.overlayContainer = this.overlayContainerService.getContainerElement();

  if(this.dat && this.dat.uuid && this.data.tab !== 1) {
    this.structureService.getMolfile(this.dat.uuid);
  }

  if(this.dat && this.dat.name) {
    this.searchValue = this.dat.name;
  }
  this.activeTab = this.data.tab;
  setTimeout(() => {
    this.activeTab = this.data.tab;
  }, 10);

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
      } else if (
        this.dat && this.dat.molfile
      ) {
        this.editor.setMolecule(this.dat.molfile);
        this.overlayContainer.style.zIndex = '10003';
      }
    
    setTimeout(() => {
      // re-adjust z-index after editor messes it up (to adjust relative index for periodic table, right click)
      this.overlayContainer.style.zIndex = '1003';
  
      this.overlayContainer.style.zIndex = '10003';
      }, 100);
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

      navString += '?structure_search=' + navigationExtras.queryParams['structure_search']
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
      if (this.order) {
        navigationExtras.queryParams['order'] = this.order;

        navString += '&order=' + this.order;
      }
    }

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

  }


  searchSubstances(structureSearchTerm?: string, smiles?: string, type?: string) {
    let size = this.pageSize;
    let index = this.pageIndex * this.pageSize;
    if (structureSearchTerm){
      this.privateStructureSearchTerm = structureSearchTerm || null;
      this.privateSearchType = this.searchType || 'substructure';
  
      if (this.searchType === 'similarity') {
        this.privateSearchCutoff = this.similarityCutoff || 0;
      }


    } else {
      this.privateStructureSearchTerm = null;
      size = this.namePageSize;
      index = this.namePageIndex * this.namePageSize;
    }
    let sort = null;
    if(type && type === 'name') {
      sort = this.order;
   
          }
      this.loadingService.setLoading(true);
      this.loading = true;
      const subscription = this.substanceService.getSubstancesSummaries({
        searchTerm: this.privateSearchTerm,
        structureSearchTerm: this.privateStructureSearchTerm,
        sequenceSearchTerm: this.privateSequenceSearchTerm,
        cutoff: this.privateSearchCutoff,
        type: this.privateSearchType,
        seqType: this.privateSearchSeqType,
        order: sort,
        pageSize: size,
        facets: this.privateFacetParams,
        skip: index,
        sequenceSearchKey: this.privateSequenceSearchKey,
        deprecated: false
      })
        .subscribe(pagingResponse => {
 
          if(type && type === 'name') {
            this.nameSubstances = (pagingResponse && pagingResponse.content) ? pagingResponse.content : [];
            this.nameTotalSubstances = pagingResponse.total;
          } else {
            this.substances = (pagingResponse && pagingResponse.content) ? pagingResponse.content : [];
            this.totalSubstances = pagingResponse.total;
            if (this.totalSubstances > 0) {
              this.panelOpenState = false;
            }
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

            this.loading = false;
            });

        });

      }

      openStructureImportDialog(): void {
        const dialogRef = this.dialog.open(StructureImportComponent, {
          height: 'auto',
          width: '650px',
          data: {}
        });
      //  this.overlayContainer.style.zIndex = '1002';
    
        dialogRef.afterClosed().subscribe((structurePostResponse?: InterpretStructureResponse) => {
          setTimeout(() => {
            this.overlayContainer.style.zIndex = '1003';
            this.overlayContainer.style.zIndex = '10003';
            });
          if (structurePostResponse && structurePostResponse.structure && structurePostResponse.structure.molfile) {
            setTimeout(()=>{
              this.editor.setMolecule(structurePostResponse.structure.molfile);
            })
          }
        }, () => {
          setTimeout(() => {
            this.overlayContainer.style.zIndex = '1003';
            this.overlayContainer.style.zIndex = '10003';
            });
        });
      }
    
      openStructureExportDialog(): void {
        const dialogRef = this.dialog.open(StructureExportComponent, {
          height: 'auto',
          width: '650px',
          data: {
            molfile: this.editor.getMolfile(),
            smiles: this.editor.getSmiles()
          }
        });
      //  this.overlayContainer.style.zIndex = '1002';
    
        dialogRef.afterClosed().subscribe(() => {
          setTimeout(() => {
            this.overlayContainer.style.zIndex = '1003';
            this.overlayContainer.style.zIndex = '10003';
            });
        }, () => {
          setTimeout(() => {
            this.overlayContainer.style.zIndex = '1003';
            this.overlayContainer.style.zIndex = '10003';
            });
        });
      }


  checkImg(term: any) {
    term.fragmentSrc = this.CVService.getStructureUrlFragment(term.fragmentStructure);
    term.simpleSrc = this.CVService.getStructureUrlFragment(term.simplifiedStructure);

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
        this.panelOpenState = true;
        if (this.activeTab === 1) {
          this.activeTab = 0;
          this.dat.molfile = molfile;
        } else {
          setTimeout(()=> {
            if (this.editor) {
              this.editor.setMolecule(molfile);
            }
          }, 150);
        }
       
      }
      if (response && response === 'select') {
        this.selectSubstance(substance);

      }
      this.overlayContainer.style.zIndex = '1003';
      subscription.unsubscribe();
    }, () => {
      this.overlayContainer.style.zIndex = '1003';
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
        this.searchSubstances(null, null, 'name');
  
    } else {
      this.pageSize = pageEvent.pageSize;
      this.pageIndex = pageEvent.pageIndex;
        this.searchSubstances(this.response);
   
    }
    
  }
}


