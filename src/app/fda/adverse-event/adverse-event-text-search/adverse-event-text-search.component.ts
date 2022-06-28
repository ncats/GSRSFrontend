import { Component, OnInit, ElementRef, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { SubstanceSuggestionsGroup } from '@gsrs-core/utils/substance-suggestions-group.model';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics/google-analytics.service';
import { ConfigService } from '@gsrs-core/config';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { AdverseEventService } from '../service/adverseevent.service';

@Component({
  selector: 'app-adverse-event-text-search',
  templateUrl: './adverse-event-text-search.component.html',
  styleUrls: ['./adverse-event-text-search.component.scss']
})

export class AdverseEventTextSearchComponent implements OnInit, AfterViewInit, OnDestroy {
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
    public adverseEventService: AdverseEventService,
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
        return this.adverseEventService.getAdverseEventSearchSuggestions(searchValue.toUpperCase(), this.eventCategory);
      })
    ).subscribe((response: SubstanceSuggestionsGroup) => {
      this.substanceSuggestionsGroup = response;
      let showTypes = [];
      if (this.eventCategory && this.eventCategory === 'adverseEventPtSearch') {
        showTypes = ['PT_Term', 'Prim_SOC', 'Ingredient_Name', 'ATC_Level_1', 'ATC_Level_2', 'ATC_Level_3', 'ATC_Level_4'];
      } else if (this.eventCategory && this.eventCategory === 'adverseEventDmeSearch') {
        showTypes = ['DME_Reactions', 'PTTerm_Meddra', 'Ingredient_Name', 'ATC_Level_1', 'ATC_Level_2', 'ATC_Level_3', 'ATC_Level_4'];
      } else if (this.eventCategory && this.eventCategory === 'adverseEventCvmSearch') {
        showTypes = ['Adverse_Event', 'Route_of_Administration', 'Ingredient_Name', 'Species', 'ATC_Level_1', 'ATC_Level_2', 'ATC_Level_3', 'ATC_Level_4'];
      }

      this.suggestionsFields = Object.keys(this.substanceSuggestionsGroup).filter(function (item) {
        return showTypes.indexOf(item) > -1;
      });

      this.suggestionsFields.forEach((value, index) => {
        if (value === 'DME_Reactions') {
          this.suggestionsFields[index] = { value: 'DME_Reactions', display: 'DME Reactions' };
        } else if (value === 'PTTerm_Meddra') {
          this.suggestionsFields[index] = { value: 'PTTerm_Meddra', display: 'PTTerm Meddra' };
        } else if (value === 'PT_Term') {
          this.suggestionsFields[index] = { value: 'PT_Term', display: 'PT Term' };
        } else if (value === 'Adverse_Event') {
          this.suggestionsFields[index] = { value: 'Adverse_Event', display: 'Adverse Event' };
        } else if (value === 'Prim_SOC') {
          this.suggestionsFields[index] = { value: 'Prim_SOC', display: 'Prim SOC' };
        } else if (value === 'Route_of_Administration') {
          this.suggestionsFields[index] = { value: 'Route_of_Administration', display: 'Route of Administration' };
        } else if (value === 'Species') {
          this.suggestionsFields[index] = { value: 'Species', display: 'Species' };
        } else if (value === 'Ingredient_Name') {
          this.suggestionsFields[index] = { value: 'Ingredient_Name', display: 'Ingredient Name' };
        } else if (value === 'ATC_Level_1') {
          this.suggestionsFields[index] = { value: 'ATC_Level_1', display: 'ATC Level 1' };
        } else if (value === 'ATC_Level_2') {
          this.suggestionsFields[index] = { value: 'ATC_Level_2', display: 'ATC Level 2' };
        } else if (value === 'ATC_Level_3') {
          this.suggestionsFields[index] = { value: 'ATC_Level_3', display: 'ATC Level 3' };
        } else if (value === 'ATC_Level_4') {
          this.suggestionsFields[index] = { value: 'ATC_Level_4', display: 'ATC Level 4' };
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

  ngOnDestroy() { }

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
