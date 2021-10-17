import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics/google-analytics.service';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceSuggestionsGroup } from '@gsrs-core/utils';
import { AdvancedSearchService } from '../service/advanced-search.service';

@Component({
  selector: 'app-type-ahead-search',
  templateUrl: './type-ahead-search.component.html',
  styleUrls: ['./type-ahead-search.component.scss']
})
export class TypeAheadSearchComponent implements OnInit {
  searchControl = new FormControl();
  substanceSuggestionsGroup: SubstanceSuggestionsGroup;
  suggestionsFields: Array<any>;
  suggestions: Array<any> = [];
  private testElem: HTMLElement;
  query: string;
  matOpen = true;
  categorySearch: string;

  @Input() eventCategory: string;

  @Output() searchPerformed = new EventEmitter<string>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  constructor(
    private advancedSearchService: AdvancedSearchService,
    public configService: ConfigService,
    public gaService: GoogleAnalyticsService)
    {}

  @Input()
  set category(cat) {
    this.categorySearch = cat;
  }

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchValue => {
        this.query = searchValue;
        const eventCategory = this.eventCategory || 'advancedSearchTypeAheadTextSearch';
        const eventLabel = !this.configService.environment.isAnalyticsPrivate && searchValue || 'search term';
        this.gaService.sendEvent(eventCategory, 'TypeAheadSearch:enter-term', eventLabel);
        return this.advancedSearchService.getTypeAheadSearchText(this.categorySearch, 'null', searchValue)
      })
    ).subscribe((response: SubstanceSuggestionsGroup) => {
      this.substanceSuggestionsGroup = response;
      this.suggestionsFields = Object.keys(this.substanceSuggestionsGroup);
    //  this.suggestions = response['Name'];
    }, error => {
      this.gaService.sendException('type ahead search suggestion error from API call');
      console.log(error);
    });

  }

  typedSearchTextChange(text: string) {
    let searchTerm = text;
  }

  searchOptionSelected(event?: MatAutocompleteSelectedEvent) {
    const eventCategory = this.eventCategory || 'advancedSearchTypeAheadTextSearch';
    const eventLabel = !this.configService.environment.isAnalyticsPrivate && event.option.value || 'auto-complete option';
    this.gaService.sendEvent(eventCategory, 'select:auto-complete', eventLabel);
    let searchTerm = event.option.value;

    this.searchPerformed.emit(searchTerm);
  }

  highlight(field: string) {
    if (!this.query) {
      return field;
    } else {
      if (this.matOpen) {
        this.testElem = document.querySelector('#overflow') as HTMLElement;
        if (this.testElem != null) {
          this.testElem.innerText = field;
          if (this.testElem.scrollWidth > this.testElem.offsetWidth) {
            const pos = field.toUpperCase().indexOf(this.query.toUpperCase());
            field = '...' + field.substring(pos - 15, field.length);
          }
        }
      }
      const query = this.query.replace(/(?=[() ])/g, '\\');
      return field.replace(new RegExp(query, 'gi'), match => {
        return '<strong>' + match + '</strong>';
      });
    }
  }

  focused(): void {
    if (this.suggestionsFields != null && this.suggestionsFields.length > 0) {
      this.matOpen = true;
      this.opened.emit();
    }
  }

  autoCompleteClosed(): void {
    this.matOpen = false;
    this.closed.emit();
  }


}
