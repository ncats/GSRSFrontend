import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Location, LocationStrategy } from '@angular/common';

/* GSRS Core Imports */
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ConfigService } from '@gsrs-core/config';
import { Facet, FacetsManagerService, FacetUpdateEvent } from '@gsrs-core/facets-manager';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { GeneralService } from '../../service/general.service';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { FacetParam } from '@gsrs-core/facets-manager';
import { DisplayFacet } from '@gsrs-core/facets-manager/display-facet';
import { NarrowSearchSuggestion } from '@gsrs-core/utils';
import { environment } from '../../../../environments/environment';
import { SubstanceSuggestionsGroup } from '@gsrs-core/utils/substance-suggestions-group.model';
import { StructureImageModalComponent } from '@gsrs-core/structure';

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service'
import { InvitroAssayInformation } from '../model/invitro-pharmacology.model';
import { invitroPharmacologySearchSortValues } from '../invitro-pharmacology-browse/invitro-pharmacology-search-sort-values';

@Component({
  selector: 'app-invitro-pharmacology-text-search',
  templateUrl: './invitro-pharmacology-text-search.component.html',
  styleUrls: ['./invitro-pharmacology-text-search.component.scss']
})
export class InvitroPharmacologyTextSearchComponent implements OnInit, AfterViewInit, OnDestroy {

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
    private element: ElementRef,
    private configService: ConfigService,
    private cvService: ControlledVocabularyService,
    private invitroPharmacologyService: InvitroPharmacologyService
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
        return this.invitroPharmacologyService.getInvitroPharmacologySearchSuggestions(searchValue.toUpperCase());
      })
    ).subscribe((response: SubstanceSuggestionsGroup) => {
      this.substanceSuggestionsGroup = response;
      let showTypes = ['Target_Name', 'Test_Agent', 'Application_Type_Number', 'Laboratory_Name', 'Control_Type'];
      this.suggestionsFields = Object.keys(this.substanceSuggestionsGroup).filter(function (item) {
        return showTypes.indexOf(item) > -1;
      });
      // this.suggestionsFields.sort(function (x, y) { return x === 'Display_Name' ? -1 : y === 'Display_Name' ? 1 : 0; });
      this.suggestionsFields.forEach((value, index) => {
        if (value === 'Target_Name') {
          this.suggestionsFields[index] = { value: 'Target_Name', display: 'Target Name' };
        } else if (value === 'Test_Agent') {
          this.suggestionsFields[index] = { value: 'Test_Agent', display: 'Test Agent' };
        } else if (value === 'Application_Type_Number') {
          this.suggestionsFields[index] = { value: 'Application_Type_Number', display: 'Application Type Number' };
        } else if (value === 'Laboratory_Name') {
          this.suggestionsFields[index] = { value: 'Laboratory_Name', display: 'Laboratory Name' };
        } else if (value === 'Control_Type') {
          this.suggestionsFields[index] = { value: 'Control_Type', display: 'Control Type' };
        } else if (value === 'Control') {
          this.suggestionsFields[index] = { value: 'Control', display: 'Control' };
        } else if (value === 'Study_Type') {
          this.suggestionsFields[index] = { value: 'Study_Type', display: 'Study Type' };
        } else if (value === 'Relationship_Type') {
          this.suggestionsFields[index] = { value: 'Relationship_Type', display: 'Relationship Type' };
        } else if (value === 'Laboratory_Name') {
          this.suggestionsFields[index] = { value: 'Laboratory_Name', display: 'Laboratory Name' };
        } else if (value === 'Bioassay_Type') {
          this.suggestionsFields[index] = { value: 'Bioassay_Type', display: 'Bioassay Type' };
        } else if (value === 'Assay_Format') {
          this.suggestionsFields[index] = { value: 'Assay_Format', display: 'Assay Format' };
        } else {
          this.suggestionsFields[index] = { value: value, display: value };
        }
      });

      if (this.suggestionsFields != null && this.suggestionsFields.length > 0) {
        this.matOpen = true;
        this.opened.emit();
      }

    }, error => {
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

