import {Component, OnInit, ElementRef, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SubstanceSuggestionsGroup } from '../utils/substance-suggestions-group.model';
import { UtilsService } from '../utils/utils.service';
import { SubstanceTextSearchService } from './substance-text-search.service';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-substance-text-search',
  templateUrl: './substance-text-search.component.html',
  styleUrls: ['./substance-text-search.component.scss']
})

export class SubstanceTextSearchComponent implements OnInit, AfterViewInit {
  searchControl = new FormControl();
  substanceSuggestionsGroup: SubstanceSuggestionsGroup;
  suggestionsFields: Array<any>;
  matOpen = true;
  private testElem: HTMLElement;
  private searchContainerElement: HTMLElement;
  private query: string;
  @Input() eventCategory: string;
  @Input() searchValueUpdated?: Observable<string>;
  @Output() searchPerformed  = new EventEmitter<string>();

  constructor(
    private utilsService: UtilsService,
    private element: ElementRef,
    private topSearchService: SubstanceTextSearchService,
    public gaService: GoogleAnalyticsService
  ) { }

  ngOnInit() {

    if (this.searchValueUpdated != null) {
      this.searchValueUpdated.subscribe(searchValue => {
        this.searchControl.setValue(searchValue);
      });
    }

    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchValue => {
        this.query = searchValue;
        const eventCategory = this.eventCategory || 'substanceTextSearch';
        const eventLabel = !environment.isAnalyticsPrivate && searchValue || 'search term';
        this.gaService.sendEvent(eventCategory, 'search:enter-term', eventLabel);
        return this.utilsService.getStructureSearchSuggestions(searchValue);
      })
    ).subscribe((response: SubstanceSuggestionsGroup) => {
      this.substanceSuggestionsGroup = response;
      const showTypes = [ 'Display_Name', 'CAS', 'Name', 'Approval_ID', ];
      this.suggestionsFields =   Object.keys(this.substanceSuggestionsGroup).filter(function(item) {
        return showTypes.includes(item);
      });
     /* this.suggestionsFields.forEach((value, index) => {
        if (value === 'Approval_ID') {
          this.suggestionsFields[index] = 'UNII';
        }
        if (value === 'Display_Name') {
          this.suggestionsFields[index] =  'Preferred Term';
        }
      });*/
      this.suggestionsFields.sort(function(x, y) { return x === 'Display_Name' ? -1 : y === 'Display_Name' ? 1 : 0; });
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



    // this.topSearchService.clearSearchEvent.subscribe(() => {
    //   this.searchControl.setValue('');
    //   this.router.navigate(
    //     [],
    //     {
    //       relativeTo: this.activatedRoute,
    //       queryParams: {
    //         'search': null
    //       },
    //       queryParamsHandling: 'merge'
    //     }
    //   );
    // });
  }
  setStatus(value) {
    // get matAutocomplete status so highlight() doesn't get undefined #overflow
    this.matOpen = value;
  }

  ngAfterViewInit() {
    this.searchContainerElement = this.element.nativeElement.querySelector('.search-container');
  }

  substanceSearchOptionSelected(event?: MatAutocompleteSelectedEvent) {
    const eventCategory = this.eventCategory || 'substanceTextSearch';
    const eventLabel = !environment.isAnalyticsPrivate && event.option.value || 'auto-complete option';
    this.gaService.sendEvent(eventCategory, 'select:auto-complete', eventLabel);
    this.searchPerformed.emit(event.option.value);
  }

  highlight(field: string) {
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
    const eventCategory = this.eventCategory || 'substanceTextSearch';
    const eventLabel = !environment.isAnalyticsPrivate && searchTerm || 'search term option';
    this.gaService.sendEvent(eventCategory, 'search:submit', eventLabel);
    this.searchPerformed.emit(searchTerm);
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
