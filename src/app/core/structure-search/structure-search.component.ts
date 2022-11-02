import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { InterpretStructureResponse } from '../structure/structure-post-response.model';
import { MatDialog } from '@angular/material/dialog';
import { StructureImportComponent } from '../structure/structure-import/structure-import.component';
import { Editor } from '../structure-editor/structure.editor.model';
import { LoadingService } from '../loading/loading.service';
import { environment } from '../../../environments/environment';
import { StructureService } from '../structure/structure.service';
import { FormControl } from '@angular/forms';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { StructureExportComponent } from '@gsrs-core/structure/structure-export/structure-export.component';
import { Title } from '@angular/platform-browser';
import * as _ from 'lodash';

@Component({
  selector: 'app-structure-search',
  templateUrl: './structure-search.component.html',
  styleUrls: ['./structure-search.component.scss']
})
export class StructureSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  private editor: Editor;
  private searchType: string;
  _searchtype: string;
  similarityCutoff?: number;
  showSimilarityCutoff = false;
  searchTypeControl = new FormControl();
  @ViewChild('contentContainer', { static: true }) contentContainer;
  private overlayContainer: HTMLElement;

  constructor(
    public router: Router,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private structureService: StructureService,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer,
    private titleService: Title

  ) {
    this.searchType = 'substructure';
    this._searchtype ='substructure';
  }

  ngOnInit() {
    this.gaService.sendPageView(`Structure Search`);
    this.titleService.setTitle('Structure Search');
    this.loadingService.setLoading(true);
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  ngAfterViewInit() {
    this.renderer.addClass(this.contentContainer.nativeElement, environment.structureEditor);
  }

  ngOnDestroy() {}

  molvecUpdate(mol: any) {
    this.editor.setMolecule(mol);
  }

  editorOnLoad(editor: Editor): void {
    this.loadingService.setLoading(false);
    this.editor = editor;
    setTimeout(() => {
      this.activatedRoute
        .queryParamMap
        .subscribe(params => {
          if (params.has('structure')) {
            this.structureService.getMolfile(params.get('structure')).subscribe(molfile => {
              this.editor.setMolecule(molfile);
            });
          }
          if (params.has('type')) {
            this.searchType = params.get('type');
            this._searchtype = params.get('type');

          }

          if (this.searchType === 'similarity') {
            this.showSimilarityCutoff = true;
            this.similarityCutoff = params.has('cutoff') && Number(params.get('cutoff')) || 0.8;
          }

          this.searchTypeControl.setValue(this.searchType);
        });
    });
  }

  search(): void {
    const mol = this.editor.getMolfile();
    this.structureService.interpretStructure(mol).subscribe((response: InterpretStructureResponse) => {
      const eventLabel = !environment.isAnalyticsPrivate && response.structure.smiles || 'structure search term';
      this.gaService.sendEvent('structureSearch', 'button:search', eventLabel);
      console.log("awd response.structure.id "+ response.structure.id);
      this.navigateToBrowseSubstance(response.structure.id, response.structure.smiles);
    }, () => {});
  }

  standardize(standard: string): void {
    const mol = this.editor.getMolfile();
    this.structureService.interpretStructure(mol, '', standard).subscribe((response: InterpretStructureResponse) => {
      if (response && response.structure && response.structure.molfile) {
        this.editor.setMolecule(response.structure.molfile);
      }
    }, () => {});
  }


  private navigateToBrowseSubstance(structureSearchTerm: string, smiles?: string): void {

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };
  const navigationExtras2: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['structure_search'] = structureSearchTerm || null;
    navigationExtras.queryParams['type'] = this.searchType || null;

    navigationExtras2.queryParams['structure'] = structureSearchTerm;
    navigationExtras2.queryParams['type'] = this.searchType || null;

    if (this.searchType === 'similarity') {
      navigationExtras.queryParams['cutoff'] = this.similarityCutoff || 0;
      navigationExtras2.queryParams['cutoff'] = this.similarityCutoff || 0;
    }

    if (smiles != null) {
      navigationExtras.queryParams['smiles'] = smiles;
    }
  // this is a test of the push state needed
    // to keep the back button working as desired
    window.history.pushState({},'Structure Search', '/structure-search'
      + '?structure=' + navigationExtras2.queryParams['structure']
      + '&type=' + navigationExtras2.queryParams['type']
      + '&cutoff=' + navigationExtras2.queryParams['cutoff']);


    this.router.navigate(['/browse-substance'], navigationExtras);
  }

  searchTypeSelected(event): void {
    this.searchType = event.value;
    this._searchtype = event.value;


    this.gaService.sendEvent('structureSearch', 'select:search-type', this.searchType);

    if (this.searchType === 'similarity') {
      this.showSimilarityCutoff = true;
      this.similarityCutoff = 0.8;
    } else {
      this.showSimilarityCutoff = false;
    }
  }

  openStructureImportDialog(): void {
    this.gaService.sendEvent('structureSearch', 'button:import', 'import structure');
    const dialogRef = this.dialog.open(StructureImportComponent, {
      height: 'auto',
      width: '650px',
      data: {}
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe((structurePostResponse?: InterpretStructureResponse) => {
      this.overlayContainer.style.zIndex = null;

      if (structurePostResponse && structurePostResponse.structure && structurePostResponse.structure.molfile) {
        this.editor.setMolecule(structurePostResponse.structure.molfile);
      }
    }, () => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  openStructureExportDialog(): void {
    this.gaService.sendEvent('structureSearch', 'button:export', 'export structure');
    const dialogRef = this.dialog.open(StructureExportComponent, {
      height: 'auto',
      width: '650px',
      data: {
        molfile: this.editor.getMolfile(),
        smiles: this.editor.getSmiles()
      }
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(() => {
      this.overlayContainer.style.zIndex = null;
    }, () => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  searchCutoffChanged(event): void {
    this.similarityCutoff = event.value;
    this.gaService.sendEvent('structureSearch', 'slider', 'similarity-cutoff', this.similarityCutoff);
  }

  get _editor(): Editor {
    return this.editor;
  }

  get _searchType(): string {
    return this.searchType;
  }

  nameResolved(molfile: string): void {
    this.editor.setMolecule(molfile);
  }
}
