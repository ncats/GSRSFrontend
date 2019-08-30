import { Component, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { MatBottomSheetRef } from '@angular/material';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-highlighted-search-action',
  templateUrl: './highlighted-search-action.component.html',
  styleUrls: ['./highlighted-search-action.component.scss']
})
export class HighlightedSearchActionComponent implements OnInit {
  searchTerm: string;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<HighlightedSearchActionComponent>,
    public activatedRoute: ActivatedRoute
  ) {
    this.searchTerm = data.searchTerm;
  }

  ngOnInit() {
  }

  dismiss(): void {
    this.bottomSheetRef.dismiss();
  }

  get googleSearchUrl(): string {
    const googleUrl = `http://www.google.com/search?q=${encodeURIComponent(this.searchTerm)}`;
    return googleUrl;
  }

}
