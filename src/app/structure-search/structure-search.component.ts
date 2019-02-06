import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { StructurePostResponse } from '../utils/structure-post-response.model';
import { MatDialog } from '@angular/material';
import { StructureImportComponent } from '../structure/structure-import/structure-import.component';
import { Editor } from '../structure-editor/structure.editor.model';
import { LoadingService } from '../loading/loading.service';
import { environment } from '../../environments/environment';
import { StructureService } from '../structure/structure.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-structure-search',
  templateUrl: './structure-search.component.html',
  styleUrls: ['./structure-search.component.scss']
})
export class StructureSearchComponent implements OnInit, AfterViewInit {
  private editor: Editor;
  private searchType: string;
  similarityCutoff?: number;
  showSimilarityCutoff = false;
  searchTypeControl = new FormControl();

  constructor(
    public router: Router,
    private substanceService: SubstanceService,
    private dialog: MatDialog,
    private loadingService: LoadingService,
    private element: ElementRef,
    private structureService: StructureService,
    private activatedRoute: ActivatedRoute
  ) {
    this.searchType = 'substructure';
  }

  ngOnInit() {
    this.loadingService.setLoading(true);
  }

  ngAfterViewInit() {
    const contentContainerElement = this.element.nativeElement.querySelector('.content-container');
    contentContainerElement.classList.add(environment.structureEditor);
  }

  editorOnLoad(editor: Editor): void {
    this.loadingService.setLoading(false);
    this.editor = editor;
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
  }

  search(): void {
    const mol = this.editor.getMolfile();
    this.substanceService.postSubstance(mol).subscribe((response: StructurePostResponse) => {
      this.navigateToBrowseSubstance(response.structure.id, response.structure.smiles);
    }, () => {});
  }

  private navigateToBrowseSubstance(structureSearchTerm: string, smiles?: string): void {

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['structure_search_term'] = structureSearchTerm || null;
    navigationExtras.queryParams['structure_search_type'] = this.searchType || null;

    if (this.searchType === 'similarity') {
      navigationExtras.queryParams['structure_search_cutoff'] = this.similarityCutoff || 0;
    }

    if (smiles != null) {
      navigationExtras.queryParams['smiles'] = smiles;
    }

    this.router.navigate(['/browse-substance'], navigationExtras);
  }

  searchTypeSelected(event): void {
    this.searchType = event.value;

    if (this.searchType === 'similarity') {
      this.showSimilarityCutoff = true;
      this.similarityCutoff = 0.5;
    } else {
      this.showSimilarityCutoff = false;
    }
  }

  openStructureImportDialog(): void {
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
  }

  get _editor(): Editor {
    return this.editor;
  }

  get _searchType(): string {
    return this.searchType;
  }

}
