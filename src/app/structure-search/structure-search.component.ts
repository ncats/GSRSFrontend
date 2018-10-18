import { Component, OnInit } from '@angular/core';
import { Ketcher } from 'ketcher-wrapper';
import { NavigationExtras, Router } from '@angular/router';

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
    private router: Router
  ) { }

  ngOnInit() {
  }

  ketcherOnLoad(ketcher: Ketcher): void {
    this.ketcher = ketcher;
  }

  search(): void {
    const smiles = this.ketcher.getSmiles();
    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['structure_search_term'] = smiles || null;
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

  searchCutoffChanged(event): void {
    this.similarityCutoff = event.value;
  }

}
