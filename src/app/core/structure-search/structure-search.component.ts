import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, OnDestroy } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { StructurePostResponse, ResolverResponse } from '../structure/structure-post-response.model';
import { MatDialog } from '@angular/material';
import { StructureImportComponent } from '../structure/structure-import/structure-import.component';
import { Editor } from '../structure-editor/structure.editor.model';
import { LoadingService } from '../loading/loading.service';
import { environment } from '../../../environments/environment';
import { StructureService } from '../structure/structure.service';
import { FormControl } from '@angular/forms';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { SubstanceSummary} from '../substance/substance.model';
import {SafeUrl} from '@angular/platform-browser';
import {PagingResponse} from '../utils/paging-response.model';
import {forkJoin} from 'rxjs';

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
  resolved: string;
  errorMessage: string;
  resolvedNames: Array<ResolverResponse>;
  matchedNames: PagingResponse<SubstanceSummary>;
  searchTypeControl = new FormControl();
  resolverControl = new FormControl();
  @ViewChild('contentContainer') contentContainer;

  constructor(
    public router: Router,
    private substanceService: SubstanceService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private structureService: StructureService,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private gaService: GoogleAnalyticsService
  ) {
    this.searchType = 'substructure';
  }

  ngOnInit() {
    this.gaService.sendPageView(`Structure Search`);
    this.loadingService.setLoading(true);
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

    dialogRef.afterClosed().subscribe((molfile?: string) => {
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

  resolveName(name: string): void {
    this.errorMessage = '';
    this.resolvedNames = [];
    this.matchedNames = null;
    this.loadingService.setLoading(true);
    const n = name.replace('"', '');
    const searchStr = 'root_names_name:"^${n}$" OR root_approvalID:"^${n}$" OR root_codes_BDNUM:"^${n}$"';
    forkJoin(this.substanceService.getSubstanceSummaries(searchStr),
      this.structureService.resolveName(name)).subscribe(([local, remote]) => {
        this.loadingService.setLoading(false);
        this.resolvedNames = remote;
        this.matchedNames = local;
        if (this.matchedNames.content.length === 0 && this.resolvedNames.length === 0) {
         this.errorMessage = 'no results found for \'' + name + '\'';
        }
      },
      error => {
        this.errorMessage = 'there was a problem returning your query';

        this.loadingService.setLoading(false);
      });
  }

  resolveNameKey(event: any): void {
    if (event.keyCode === 13) {
      this.resolveName(this.resolverControl.value);
    }
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.structureService.getSafeStructureImgUrl(structureId, size);
  }

  applyStructure(molfile: string) {
    this.editor.setMolecule(molfile);
  }

  getName(name: string): void {
    const n = name.replace('"', '');
    const searchStr = 'root_names_name:"^${n}$" OR root_approvalID:"^${n}$" OR root_codes_BDNUM:"^${n}$"';
    this.substanceService.getSubstanceSummaries(searchStr).subscribe(response => {
    this.loadingService.setLoading(false); },
        error => {
          this.loadingService.setLoading(false);
    });
  }


}
