import {Component, OnInit, ElementRef, AfterViewInit, Pipe} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SubstanceSuggestionsGroup } from '../utils/substance-suggestions-group.model';
import { UtilsService } from '../utils/utils.service';
import { TopSearchService } from './top-search.service';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-top-search',
  templateUrl: './top-search.component.html',
  styleUrls: ['./top-search.component.scss']
})

export class TopSearchComponent implements OnInit, AfterViewInit {
  searchControl = new FormControl();
  substanceSuggestionsGroup: SubstanceSuggestionsGroup;
  suggestionsFields: Array<any>;
  matOpen = true;
  private testElem: HTMLElement;
  private searchContainerElement: HTMLElement;
  private query: string;


  constructor(
    private utilsService: UtilsService,
    private router: Router,
    private element: ElementRef,
    private topSearchService: TopSearchService,
    private activatedRoute: ActivatedRoute,
    public gaService: GoogleAnalyticsService
  ) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot.queryParamMap.has('search')) {
      this.searchControl.setValue(this.activatedRoute.snapshot.queryParamMap.get('search'));
    }

    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchValue => {
        this.query = searchValue;
        const eventLabel = !environment.isAnalyticsPrivate && searchValue || 'search term';
        this.gaService.sendEvent('topSearch', 'search:enter-term', eventLabel);
        return this.utilsService.getStructureSearchSuggestions(searchValue);
      })
    ).subscribe((response: SubstanceSuggestionsGroup) => {
      this.substanceSuggestionsGroup = response;
      const showTypes = [ 'Display_Name', 'CAS', 'Name', 'Approval_ID', ];
      this.suggestionsFields =   Object.keys(this.substanceSuggestionsGroup).filter(function(item) {
        return showTypes.includes(item);
      });
      console.log(this.suggestionsFields);
     /* this.suggestionsFields.forEach((value, index) => {
        if (value === 'Approval_ID') {
          this.suggestionsFields[index] = 'UNII';
        }
        if (value === 'Display_Name') {
          this.suggestionsFields[index] =  'Preferred Term';
        }
      });*/
      this.suggestionsFields.sort(function(x, y) { return x == 'Display_Name' ? -1 : y == 'Display_Name' ? 1 : 0; });
      this.suggestionsFields.forEach((value, index) => {
        if (value === 'Approval_ID') {
          this.suggestionsFields[index] = {value: 'Approval_ID', display: 'UNII'};
        } else if (value === 'Display_Name') {
          this.suggestionsFields[index] =  {value: 'Display_Name', display: 'Preferred Term'};
        } else {
          this.suggestionsFields[index] =  {value: value, display: value};
        }
      });

    }, error => {
      this.gaService.sendException('search suggestion error from API call');
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
  setStatus(value) {
    //get matAutocomplete status so highlight() doesn't get undefined #overflow
    this.matOpen = value;
  }

  ngAfterViewInit() {
    this.searchContainerElement = this.element.nativeElement.querySelector('.search-container');
  }

  substanceSearchOptionSelected(event?: MatAutocompleteSelectedEvent) {
    const eventLabel = !environment.isAnalyticsPrivate && event.option.value || 'auto-complete option';
    this.gaService.sendEvent('topSearch', 'select:auto-complete', eventLabel);
    this.navigateToSearchResults(event.option.value);
  }

  highlight(field) {
    if (!this.query) {
      return field;
    } else {
      if (this.matOpen) {
        this.testElem = document.querySelector('#overflow') as HTMLElement;
        this.testElem.innerText = field;
        if (this.testElem.scrollWidth > this.testElem.offsetWidth) {
          const pos = field.toUpperCase().indexOf(this.query.toUpperCase());
          field = '...' + field.substring(pos - 15, field.length);
        }
      }
      return field.replace(new RegExp(this.query, 'gi'), match => {
        return '<strong>' + match + '</strong>';
      });
    }

  }

  processSubstanceSearch() {
    const searchTerm = this.searchControl.value;
    const eventLabel = !environment.isAnalyticsPrivate && searchTerm || 'search term option';
    this.gaService.sendEvent('topSearch', 'search:submit', eventLabel);
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
