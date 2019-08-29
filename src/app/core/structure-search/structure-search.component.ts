import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { StructurePostResponse } from '../structure/structure-post-response.model';
import { MatDialog } from '@angular/material';
import { StructureImportComponent } from '../structure/structure-import/structure-import.component';
import { Editor } from '../structure-editor/structure.editor.model';
import { LoadingService } from '../loading/loading.service';
import { environment } from '../../../environments/environment';
import { StructureService } from '../structure/structure.service';
import { FormControl } from '@angular/forms';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-structure-search',
  templateUrl: './structure-search.component.html',
  styleUrls: ['./structure-search.component.scss']
})
export class StructureSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  private editor: Editor;
  private searchType: string;
  similarityCutoff?: number;
  showSimilarityCutoff = false;
  searchTypeControl = new FormControl();
  @ViewChild('contentContainer') contentContainer;
  private overlayContainer: HTMLElement;

  constructor(
    public router: Router,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private structureService: StructureService,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer
  ) {
    this.searchType = 'substructure';
  }

  ngOnInit() {
    this.gaService.sendPageView(`Structure Search`);
    this.loadingService.setLoading(true);
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  ngAfterViewInit() {
    this.renderer.addClass(this.contentContainer.nativeElement, environment.structureEditor);
  }

  ngOnDestroy() {}

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
          }

          if (this.searchType === 'similarity') {
            this.showSimilarityCutoff = true;
            this.similarityCutoff = params.has('cutoff') && Number(params.get('cutoff')) || 0.5;
          }

          this.searchTypeControl.setValue(this.searchType);
        });
    });
  }

  search(): void {
    const mol = this.editor.getMolfile();
    this.structureService.postStructure(mol).subscribe((response: StructurePostResponse) => {
      const eventLabel = !environment.isAnalyticsPrivate && response.structure.smiles || 'structure search term';
      this.gaService.sendEvent('structureSearch', 'button:search', eventLabel);
      this.navigateToBrowseSubstance(response.structure.id, response.structure.smiles);
    }, () => {});
  }

  private navigateToBrowseSubstance(structureSearchTerm: string, smiles?: string): void {

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['structure_search'] = structureSearchTerm || null;
    navigationExtras.queryParams['type'] = this.searchType || null;

    if (this.searchType === 'similarity') {
      navigationExtras.queryParams['cutoff'] = this.similarityCutoff || 0;
    }

    if (smiles != null) {
      navigationExtras.queryParams['smiles'] = smiles;
    }

    this.router.navigate(['/browse-substance'], navigationExtras);
  }

  searchTypeSelected(event): void {
    this.searchType = event.value;

    this.gaService.sendEvent('structureSearch', 'select:search-type', this.searchType);

    if (this.searchType === 'similarity') {
      this.showSimilarityCutoff = true;
      this.similarityCutoff = 0.5;
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

    dialogRef.afterClosed().subscribe((molfile?: string) => {
      this.overlayContainer.style.zIndex = null;
      if (molfile != null) {
        this.editor.setMolecule(molfile);
      }
    }, () => {});
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
