import { Component, OnInit, ElementRef, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

/* GSRS Core Imports */
import { SubstanceSuggestionsGroup } from '@gsrs-core/utils/substance-suggestions-group.model';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics/google-analytics.service';
import { ConfigService } from '@gsrs-core/config';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';

/* GSRS Impurities Imports */
import { ImpuritiesService } from '../service/impurities.service';
import { Impurities } from '../model/impurities.model';

@Component({
  selector: 'app-impurities-text-search',
  templateUrl: './impurities-text-search.component.html',
  styleUrl: './impurities-text-search.component.scss',
  standalone: false
})

export class ImpuritiesTextSearchComponent implements OnInit, OnDestroy {

  private subscriptions: Array<Subscription> = [];

  searchControl = new FormControl();
  substanceSuggestionsGroup: SubstanceSuggestionsGroup;
  suggestionsFields: Array<any>;
  matOpen = true;
  private testElem: HTMLElement;
  private searchContainerElement: HTMLElement;
  private query: string;
  @Input() eventCategory: string;
  @Input() styling?: string;
  @Output() searchPerformed = new EventEmitter<string>();
  @Output() searchValueOut = new EventEmitter<string>();
  @Input() placeholder = 'Search';
  @Input() hintMessage = '';
  private privateErrorMessage = '';
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Input() source?: string;
  private CasDisplay = 'CAS';
  codeSystemVocab?: any;

  constructor(
    public impuritiesService: ImpuritiesService,
    private element: ElementRef,
    public gaService: GoogleAnalyticsService,
    public configService: ConfigService,
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchValue => {
        this.query = searchValue;
        this.searchValueOut.emit(this.query);
        const eventCategory = this.eventCategory || 'substanceTextSearch';
        const eventLabel = !this.configService.environment.isAnalyticsPrivate && searchValue || 'search term';
        this.gaService.sendEvent(eventCategory, 'search:enter-term', eventLabel);
        return this.impuritiesService.getProductSearchSuggestions(searchValue.toUpperCase());
      })
    ).subscribe((response: SubstanceSuggestionsGroup) => {
      this.substanceSuggestionsGroup = response;
      let showTypes = ['Source', 'Source_Type', 'Source_ID', 'System', 'Test', 'Test_Type',
        'Elution_Type', 'Substance_Name', 'Substance_Name_(Preferred)', 'Ingredient_Type'];

      this.suggestionsFields = Object.keys(this.substanceSuggestionsGroup).filter(function (item) {
        return showTypes.indexOf(item) > -1;
      });

      this.suggestionsFields.forEach((value, index) => {
        if (value === 'Source') {
          this.suggestionsFields[index] = { value: 'Source', display: 'Source' };
        } else if (value === 'Source_Type') {
          this.suggestionsFields[index] = { value: 'Source_Type', display: 'Source Type' };
        } else if (value === 'Source_ID') {
          this.suggestionsFields[index] = { value: 'Source_ID', display: 'Source ID' };
        } else if (value === 'System') {
          this.suggestionsFields[index] = { value: 'System', display: 'System' };
        } else if (value === 'Test') {
          this.suggestionsFields[index] = { value: 'Test', display: 'Test' };
        } else {
          this.suggestionsFields[index] = { value: value, display: value };
        }
      });

      if (this.suggestionsFields != null && this.suggestionsFields.length > 0) {
        this.matOpen = true;
        this.opened.emit();
      }

    }, error => {
      this.gaService.sendException('search suggestion error from API call');
      console.log(error);
    });
    
  }

  ngOnDestroy(): void {
    // this.applicationService.unloadSubstance();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  @Input()
  set searchValue(searchValue: string) {
    this.searchControl.setValue(searchValue);
  }

  @Input()
  set errorMessage(errorMessage: string) {
    this.searchControl.markAsTouched();
    if (errorMessage) {
      this.searchControl.setErrors({
        error: true
      });
    } else {
      this.searchControl.setErrors(null);
    }
    this.privateErrorMessage = errorMessage;
  }

  get errorMessage(): string {
    return this.privateErrorMessage;
  }

  autoCompleteClosed(): void {
    this.matOpen = false;
    this.closed.emit();
  }

  focused(): void {
    if (this.suggestionsFields != null && this.suggestionsFields.length > 0) {
      this.matOpen = true;
      this.opened.emit();
    }
  }

  ngAfterViewInit() {
    this.searchContainerElement = this.element.nativeElement.querySelector('.search-container');
  }

  substanceSearchOptionSelected(event?: MatAutocompleteSelectedEvent) {
    const eventCategory = this.eventCategory || 'substanceTextSearch';
    const eventLabel = !this.configService.environment.isAnalyticsPrivate && event.option.value || 'auto-complete option';
    this.gaService.sendEvent(eventCategory, 'select:auto-complete', eventLabel);
    let searchTerm = event.option.value;

    searchTerm = this.topSearchClean(searchTerm);

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

  processSubstanceSearch() {
    let searchTerm = this.searchControl.value;
    const eventCategory = this.eventCategory || 'substanceTextSearch';
    const eventLabel = !this.configService.environment.isAnalyticsPrivate && searchTerm || 'search term option';
    this.gaService.sendEvent(eventCategory, 'search:submit', eventLabel);

    // Clean up searchTerm
    searchTerm = this.topSearchClean(searchTerm);

    this.searchPerformed.emit(searchTerm);
  }

  activateSearch(): void {
    if (this.source) {
      this.searchContainerElement.classList.add('active-' + this.source);
    } else {
      this.searchContainerElement.classList.add('active-search');
    }
  }

  deactivateSearch(): void {
    this.searchContainerElement.classList.add('deactivate-search');
    setTimeout(() => {
      if (this.source) {

        this.searchContainerElement.classList.remove('active-' + this.source);
        this.searchContainerElement.classList.remove('deactivate-search');
      } else {
        this.searchContainerElement.classList.remove('active-search');
        this.searchContainerElement.classList.remove('deactivate-search');
      }
    }, 300);
  }

  topSearchClean(searchTerm): string {
    if (searchTerm && searchTerm.length > 0) {
      //escape literal forward slashes in a search first
      searchTerm = searchTerm.replace(/(?<!\\)\//g, '\\/');
      searchTerm = searchTerm.trim();
      if (searchTerm.indexOf('"') < 0 && searchTerm.indexOf('*') < 0 && searchTerm.indexOf(':') < 0
        && searchTerm.indexOf(' AND ') < 0 && searchTerm.indexOf(' OR ') < 0) {
        // Put slash in front of brackets, for example:
        // 1. [INN] to \[INN\]
        // 2. IBUPROFEN [INN] to IBUPROFEN \[INN\]
        // 3. *[INN] to *\[INN\]
        // 4. [INN]* to \[INN\]*
        // 5. "[INN]" to "\[INN\]"
        // 6. "IBUPROFEN [INN]" to "IBUPROFEN \[INN\]"
        // 7. "*[INN]" to "*\[INN\]"
        // 8. [INN]* to \[INN\]*
        searchTerm = '"' + searchTerm
          .replace(/([^\\])\[/g, "$1\\[").replace(/^\[/g, "\\[")
          .replace(/([^\\])\]/g, "$1\\]").replace(/^\]/g, "\\]")
          + '"';
      } else if (searchTerm.indexOf(':') < 0) {
        searchTerm = searchTerm
          .replace(/([^\\])\[/g, "$1\\[").replace(/^\[/g, "\\[")
          .replace(/([^\\])\]/g, "$1\\]").replace(/^\]/g, "\\]")
      }
      this.searchControl.setValue(searchTerm);
    }
    return searchTerm;
  }

}
