import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { NavigationExtras, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { SubstanceSuggestionsGroup } from '../utils/substance-suggestions-group.model';
import { UtilsService } from '../utils/utils.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {
  searchControl = new FormControl();
  substanceSuggestionsGroup: SubstanceSuggestionsGroup;
  suggestionsFields: Array<string>;
  mainPathSegment = '';

  constructor(
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchValue =>
        this.utilsService.getStructureSearchSuggestions(searchValue)
      )
    ).subscribe((response: SubstanceSuggestionsGroup) => {
      this.substanceSuggestionsGroup = response;
      this.suggestionsFields = Object.keys(this.substanceSuggestionsGroup);
    }, error => {
      console.log(error);
    });

    this.mainPathSegment = this.getMainPathSegmentFromUrl(this.router.routerState.snapshot.url.substring(1));

    this.router.events.subscribe((event: RouterEvent) => {

      if (event instanceof NavigationEnd) {
        this.mainPathSegment = this.getMainPathSegmentFromUrl(event.url.substring(1));
      }
    });
  }

  getMainPathSegmentFromUrl(url: string): string {
    const path = url.split('?')[0];
    const mainPathPart = path.split('/')[0];
    return mainPathPart;
  }

  substanceSearchOptionSelected(event?: MatAutocompleteSelectedEvent) {
    this.navigateToSearchResults(event.option.value);
  }

  processSubstanceSearch() {
    const searchTerm = this.searchControl.value;
    this.navigateToSearchResults(searchTerm);
  }

  navigateToSearchResults(searchTerm: string) {

    const navigationExtras: NavigationExtras = {
      queryParams: searchTerm ? { 'search_term': searchTerm } : null
    };

    this.router.navigate(['/browse-substance'], navigationExtras);
  }

}
