import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SubstanceSuggestionsGroup } from '../utils/substance-suggestions-group.model';
import { UtilsService } from '../utils/utils.service';
import { TopSearchService } from './top-search.service';

@Component({
  selector: 'app-top-search',
  templateUrl: './top-search.component.html',
  styleUrls: ['./top-search.component.scss']
})
export class TopSearchComponent implements OnInit, AfterViewInit {
  searchControl = new FormControl();
  substanceSuggestionsGroup: SubstanceSuggestionsGroup;
  suggestionsFields: Array<string>;
  private searchContainerElement: HTMLElement;

  constructor(
    private utilsService: UtilsService,
    private router: Router,
    private element: ElementRef,
    private topSearchService: TopSearchService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot.queryParamMap.has('search')) {
      this.searchControl.setValue(this.activatedRoute.snapshot.queryParamMap.get('search'));
    }

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

    this.topSearchService.clearSearchEvent.subscribe(() => {
      this.searchControl.setValue('');
      this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: {
            'search': null
          },
          queryParamsHandling: 'merge'
        }
      );
    });
  }

  ngAfterViewInit() {
    this.searchContainerElement = this.element.nativeElement.querySelector('.search-container');
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
      queryParams: searchTerm ? { 'search': searchTerm } : null
    };

    this.router.navigate(['/browse-substance'], navigationExtras);
  }

  activateSearch(): void {
    this.searchContainerElement.classList.add('active-search');
  }

  deactivateSearch(): void {
    this.searchContainerElement.classList.add('deactivate-search');
    setTimeout(() => {
      this.searchContainerElement.classList.remove('active-search');
      this.searchContainerElement.classList.remove('deactivate-search');
    }, 300);
  }

}
