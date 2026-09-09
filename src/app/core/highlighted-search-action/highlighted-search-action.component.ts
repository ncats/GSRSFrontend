import { ChangeDetectionStrategy, Component, OnInit, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router, NavigationExtras, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-highlighted-search-action',
    templateUrl: './highlighted-search-action.component.html',
    styleUrls: ['./highlighted-search-action.component.scss'],
    standalone: true,
    imports: [RouterLink, MatIconModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
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
