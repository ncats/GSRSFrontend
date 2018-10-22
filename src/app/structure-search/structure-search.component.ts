import { Component, OnInit } from '@angular/core';
import { Ketcher } from 'ketcher-wrapper/ketcher-wrapper';
import { NavigationExtras, Router } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { StructurePostResponse } from '../utils/structure-post-response.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { StructureImportComponent } from '../structure-editor/structure-import/structure-import.component';

@Component({
  selector: 'app-structure-search',
  templateUrl: './structure-search.component.html',
  styleUrls: ['./structure-search.component.scss']
})
export class StructureSearchComponent implements OnInit {
  private ketcher: Ketcher;
  private searchType: string;
  similarityCutoff?: number;
  showSimilarityCutoff = false;

  constructor(
    private router: Router,
    private substanceService: SubstanceService,
    private dialog: MatDialog
  ) {
    this.searchType = 'substructure';
  }

  ngOnInit() {
  }

  ketcherOnLoad(ketcher: Ketcher): void {
    this.ketcher = ketcher;
  }

  search(): void {
    const mol = this.ketcher.getMolfile();
    this.substanceService.postSubstance(mol).subscribe((response: StructurePostResponse) => {
      this.navigateToBrowseSubstance(response.structure.id);
    });
  }

  private navigateToBrowseSubstance(structureSearchTerm: string): void {

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['structure_search_term'] = structureSearchTerm || null;
    navigationExtras.queryParams['structure_search_type'] = this.searchType || null;

    if (this.searchType === 'similarity') {
      navigationExtras.queryParams['structure_search_cutoff'] = this.similarityCutoff || 0;
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
      height: '450px',
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  searchCutoffChanged(event): void {
    this.similarityCutoff = event.value;
  }

  openStructureImport(): void {

  }

}
