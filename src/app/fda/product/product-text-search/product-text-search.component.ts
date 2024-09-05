import { Component, OnInit, ElementRef, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { SubstanceSuggestionsGroup } from '@gsrs-core/utils/substance-suggestions-group.model';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics/google-analytics.service';
import { ConfigService } from '@gsrs-core/config';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-product-text-search',
  templateUrl: './product-text-search.component.html',
  styleUrls: ['./product-text-search.component.scss']
})

export class ProductTextSearchComponent implements OnInit, AfterViewInit, OnDestroy {
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
    public productService: ProductService,
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
        return this.productService.getProductSearchSuggestions(searchValue.toUpperCase());
      })
    ).subscribe((response: SubstanceSuggestionsGroup) => {
      this.substanceSuggestionsGroup = response;
      let showTypes = ['Active_Moiety', 'Product_Name', 'Product_Type', 'Dosage_Form_Name', 'Marketing_Category_Name',
      'Marketing_Category_Code', 'Ingredient_Name', 'Ingredient_Name_(Preferred)', 'Ingredient_Type',
      'Route_of_Administration', 'Labeler_Name', 'Labeler_Code', 'Labeler_State', 'Company_Role', 'Company_Country',
      'Manufacturer_Name', 'Manufacturer_Role', 'Application_Type', 'Application_Number', 'Application_Type_Number'];

      this.suggestionsFields = Object.keys(this.substanceSuggestionsGroup).filter(function (item) {
        return showTypes.indexOf(item) > -1;
      });
    
      this.suggestionsFields.forEach((value, index) => {
        if (value === 'Active_Moiety') {
          this.suggestionsFields[index] = { value: 'Active_Moiety', display: 'Active Moiety' };
        } else if (value === 'Product_Name') {
          this.suggestionsFields[index] = { value: 'Product_Name', display: 'Product Name' };
        } else if (value === 'Product_Type') {
          this.suggestionsFields[index] = { value: 'Product_Type', display: 'Product Type' };
        } else if (value === 'Dosage_Form_Name') {
          this.suggestionsFields[index] = { value: 'Dosage_Form_Name', display: 'Dosage Form Name' };
        } else if (value === 'Marketing_Category_Name') {
          this.suggestionsFields[index] = { value: 'Marketing_Category_Name', display: 'Marketing Category Name' };
        } else if (value === ' Marketing_Category_Code') {
          this.suggestionsFields[index] = { value: 'Marketing_Category_Code', display: 'Marketing Category Code' };
        } else if (value === 'Ingredient_Name') {
          this.suggestionsFields[index] = { value: 'Ingredient_Name', display: 'Ingredient Name' };
        } else if (value === 'Ingredient_Name_(Preferred)') {
          this.suggestionsFields[index] = { value: 'Ingredient_Name_(Preferred)', display: 'Ingredient Name (Preferred)' };
        } else if (value === 'Ingredient_Type') {
          this.suggestionsFields[index] = { value: 'Ingredient_Type', display: 'Ingredient Type' };
        } else if (value === 'Route_of_Administration') {
          this.suggestionsFields[index] = { value: 'Route_of_Administration', display: 'Route of Administration' };
        } else if (value === 'Labeler_Name') {
          this.suggestionsFields[index] = { value: 'Labeler_Name', display: 'Labeler Name' };
        } else if (value === 'Labeler_Code') {
          this.suggestionsFields[index] = { value: 'Labeler_Code', display: 'Labeler Code' };
        } else if (value === 'Labeler_State') {
          this.suggestionsFields[index] = { value: 'Labeler_State', display: 'Labeler State' };
        } else if (value === 'Company_Role') {
          this.suggestionsFields[index] = { value: 'Company_Role', display: 'Company Role' };
        } else if (value === 'Company_Country') {
          this.suggestionsFields[index] = { value: 'Company_Country', display: 'Company Country' };
        } else if (value === 'Manufacturer_Name') {
          this.suggestionsFields[index] = { value: 'Manufacturer_Name', display: 'Manufacturer Name' };
        } else if (value === 'Manufacturer_Role') {
          this.suggestionsFields[index] = { value: 'Manufacturer_Role', display: 'Manufacturer Role' };
        } else if (value === 'Application_Type') {
          this.suggestionsFields[index] = { value: 'Application_Type', display: 'Application Type' };
        } else if (value === 'Application_Number') {
          this.suggestionsFields[index] = { value: 'Application_Number', display: 'Application Number' };
        } else if (value === 'Application_Type_Number') {
          this.suggestionsFields[index] = { value: 'Application_Type_Number', display: 'Application Type Number' };
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

