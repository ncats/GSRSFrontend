import {Component, OnInit, ElementRef, AfterViewInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { SubstanceSuggestionsGroup } from '../utils/substance-suggestions-group.model';
import { UtilsService } from '../utils/utils.service';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { ConfigService } from '@gsrs-core/config';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';

@Component({
  selector: 'app-substance-text-search',
  templateUrl: './substance-text-search.component.html',
  styleUrls: ['./substance-text-search.component.scss']
})

export class SubstanceTextSearchComponent implements OnInit, AfterViewInit, OnDestroy {
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
  @Input() placeholder = 'Search';
  @Input() hintMessage = '';
  private privateErrorMessage = '';
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Input() source?: string;
  private CasDisplay = 'CAS';

  constructor(
    private utilsService: UtilsService,
    private element: ElementRef,
    public gaService: GoogleAnalyticsService,
    public configService: ConfigService,
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.cvService.getDomainVocabulary('CODE_SYSTEM').pipe(take(1)).subscribe(response => {
      let resp;
      resp = response['CODE_SYSTEM'].dictionary;
      if (resp['CAS']) {
        this.CasDisplay = resp['CAS'].display;
        }
      });
        this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchValue => {
        this.query = searchValue;
        const eventCategory = this.eventCategory || 'substanceTextSearch';
        const eventLabel = !this.configService.environment.isAnalyticsPrivate && searchValue || 'search term';
        this.gaService.sendEvent(eventCategory, 'search:enter-term', eventLabel);
        return this.utilsService.getStructureSearchSuggestions(searchValue.toUpperCase());
      })
    ).subscribe((response: SubstanceSuggestionsGroup) => {
      this.substanceSuggestionsGroup = response;
      const showTypes = [ 'Display_Name', 'CAS', 'Name', 'Approval_ID', ];
      this.suggestionsFields =   Object.keys(this.substanceSuggestionsGroup).filter(function(item) {
        return showTypes.indexOf(item) > -1;
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
        } else if(value === 'CAS'){
          this.suggestionsFields[index] =  {value: 'CAS', display: this.CasDisplay};

        } else {
          this.suggestionsFields[index] =  {value: value, display: value};
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

  getCasDisplay() {
    this.cvService.getDomainVocabulary('CODE_SYSTEM');
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

  ngOnDestroy() {}

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

    if (eventCategory === 'topSearch') {
      searchTerm = this.topSearchClean(searchTerm);
    }
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

    if (eventCategory === 'topSearch') {
     searchTerm = this.topSearchClean(searchTerm);
    }
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
        searchTerm = '"' + searchTerm + '"';
      }
      this.searchControl.setValue(searchTerm);
    }
    return searchTerm;
  }
}
