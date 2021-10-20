import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { QueryableSubstanceDictionary, CommandInput, Command } from '@gsrs-core/guided-search/queryable-substance-dictionary.model';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { typeCommandOptions, inputTypes } from '@gsrs-core/guided-search/query-statement/type-command-options.constant';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ControlledVocabularyService, VocabularyTerm } from '@gsrs-core/controlled-vocabulary';
import { AdvancedQueryStatement } from './advanced-query-statement.model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@gsrs-core/config';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { FacetsManagerService } from '@gsrs-core/facets-manager';
import { UtilsService } from '@gsrs-core/utils';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { SubstanceRelated, SubstanceSummary } from '@gsrs-core/substance';
import { ApplicationService } from '../../application/service/application.service';
import { ProductService } from '../../product/service/product.service';
import { ClinicalTrialService } from '../../clinical-trials/clinical-trial/clinical-trial.service';
import { SubstanceSuggestionsGroup } from '@gsrs-core/utils';
import { AdvancedSearchService } from '../service/advanced-search.service';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material';

@Component({
  selector: 'app-advanced-query-statement',
  templateUrl: './advanced-query-statement.component.html',
  styleUrls: ['./advanced-query-statement.component.scss']
})

export class AdvancedQueryStatementComponent implements OnInit, OnDestroy {

  queryableSubstanceDict: QueryableSubstanceDictionary;
  displayProperties: Array<string>;
  displayPropertiesCommon: Array<string>;
  queryStatements: Array<AdvancedQueryStatement> = [];
  query = '';
  @Input() queryStatementHash?: number;
  @Input() queryableOptionsCommon: Array<string>;
  // @Input() category: string;
  private _index = 0;
  private _queryableDictionary: QueryableSubstanceDictionary;
  @Output() queryUpdated = new EventEmitter<AdvancedQueryStatement>();
  // @Output() tabSelectUpdated = new EventEmitter<String>();
  private allOptions: Array<string>;
  queryableOptionsAll: Array<string>;
  queryablePropertiesControl = new FormControl();
  queryablePropertiesAutocompleteControl = new FormControl();
  private subscriptions: Array<Subscription> = [];
  conditionOptions = [
    'AND',
    'OR',
    'NOT'
  ];
  searchFields: Array<String>;
  conditionControl = new FormControl();
  categoryControl = new FormControl();
  commandControl = new FormControl();
  searchFieldControl = new FormControl();

  selectedCondition = '';
  selectedQueryableProperty: string;
  selectedQueryablePropertyType: string;
  selectedLucenePath: string;
  commandOptions: Array<string>;
  commandOptionsExample: string;
  isShowAllCommandOptions = false;
  selectedCommandOption: string;
  commandInputs: Array<CommandInput>;
  queryParts: Array<string> = [];
  private typeCommandOptions = typeCommandOptions;
  commandInputValueDict: { [queryablePropertyType: string]: Array<string | Date | number> } = {};
  private overlayContainer: HTMLElement;
  cvOptions: Array<VocabularyTerm>;
  isShowCommonFields = true;
  searchText: string;
  categoryinput: string;
  advancedQueryStatements: Array<AdvancedQueryStatement> = [];
  dictionaryFileName: string;
  searchValue: string;

  searchControl = new FormControl();
  substanceSuggestionsGroup: SubstanceSuggestionsGroup;
  suggestionsFields: Array<any>;
  suggestions: Array<any> = [];
  private testElem: HTMLElement;
  matOpen = true;
  categorySearch: string;
  typeAheadFieldName: string;
  selectedQueryableSuggest: string;
  @Output() searchPerformed = new EventEmitter<string>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() typeAheadUpdatedOut: EventEmitter<String> = new EventEmitter<String>();

  constructor(
    private overlayContainerService: OverlayContainer,
    public cvService: ControlledVocabularyService,
    private http: HttpClient,
    private router: Router,
    private configService: ConfigService,
    private utilitiesService: UtilsService,
    private substanceService: SubstanceService,
    public applicationService: ApplicationService,
    public productService: ProductService,
    private clinicalTrialService: ClinicalTrialService,
    private facetManagerService: FacetsManagerService,
    private activatedRoute: ActivatedRoute,
    private advancedSearchService: AdvancedSearchService
  ) { }

  @Input()
  set category(cat) {
    this.categoryinput = cat;
    //  this.loadSearchField();
  }

  @Input()
  set queryableDictionary(queryableSubstanceDictionary: QueryableSubstanceDictionary) {
    if (queryableSubstanceDictionary != null) {
      this._queryableDictionary = queryableSubstanceDictionary;
    }
  }

  @Input()
  set queryableOptions(options: Array<string>) {
    this.allOptions = options;
    this.queryableOptionsAll = options;
  }

  @Input()
  set index(index: number) {
    if (index != null) {
      this._index = index;
      if (this._index === 0 && this.commandInputs) {
        this.selectedCondition = '';
        this.refreshQuery();
      }
    }
  }

  get index(): number {
    return this._index;
  }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();

    inputTypes.forEach(key => {
      this.commandInputValueDict[key] = [];
    });

    const subscription = this.queryablePropertiesControl.valueChanges.subscribe(value => {
      this.queryablePropertySelected(value);
    });
    this.subscriptions.push(subscription);

    const allQueriablePropertiesSubscription = this.queryablePropertiesAutocompleteControl.valueChanges.subscribe(value => {
      this.queryableOptionsAll = this.allOptions.filter(option => {
        return option.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });
    });
    this.subscriptions.push(allQueriablePropertiesSubscription);

    const commandSubscription = this.commandControl.valueChanges.subscribe((command: string) => {
      this.setCommand(command);
    });
    this.subscriptions.push(commandSubscription);

    if (this._index > 0) {
      this.conditionControl.setValue('AND');
      this.selectedCondition = 'AND ';
      const conditionSubscription = this.conditionControl.valueChanges.subscribe((condition: string) => {
        this.selectedCondition = `${condition} `;
        this.refreshQuery();
      });
      this.subscriptions.push(conditionSubscription);
    }

    let queryStatement: AdvancedQueryStatement;

    if (this.queryStatementHash) {
      const queryStatementString = localStorage.getItem(this.queryStatementHash.toString());
      if (queryStatementString) {
        queryStatement = JSON.parse(queryStatementString);
      }
    }

    if (queryStatement != null) {
      const queryablePropertyType = this._queryableDictionary[queryStatement.queryableProperty].type;
      let inputType: string;
      const commandObject = typeCommandOptions[queryablePropertyType][queryStatement.command] as Command;
      if (commandObject.commandInputs) {
        inputType = commandObject.commandInputs[0].type;
        this.commandInputValueDict[inputType] = queryStatement.commandInputValues;
      }
      this.queryParts = queryStatement.queryParts;
      this.conditionControl.setValue(queryStatement.condition.trim(), { emitEvent: false });
      this.selectedCondition = queryStatement.condition;
      this.isShowCommonFields = this.queryableOptionsCommon.indexOf(queryStatement.queryableProperty) > -1;
      if (this.queryableOptionsCommon.indexOf(queryStatement.queryableProperty) > -1) {
        this.isShowCommonFields = true;
        this.queryablePropertiesControl.setValue(queryStatement.queryableProperty, { emitEvent: false });
      } else {
        this.isShowCommonFields = false;
        this.queryablePropertiesAutocompleteControl.setValue(queryStatement.queryableProperty, { emitEvent: false });
      }
      this.processQueriablePropertyChange(queryStatement.queryableProperty);
      this.commandControl.setValue(queryStatement.command);
    } else {
      this.queryablePropertiesControl.setValue('All');
    }

    // Type Ahead/Suggestion in Search Text box
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchValue => {
        this.query = searchValue;
        //  const eventCategory = this.eventCategory || 'advancedSearchTypeAheadTextSearch';
        //  const eventLabel = !this.configService.environment.isAnalyticsPrivate && searchValue || 'search term';
        //  this.gaService.sendEvent(eventCategory, 'TypeAheadSearch:enter-term', eventLabel);

        // Search text by fieldName for Type Ahead
        return this.advancedSearchService.getTypeAheadSearchText(this.categoryinput, this.selectedQueryableSuggest, searchValue)
      })
    ).subscribe((response: SubstanceSuggestionsGroup) => {
      this.substanceSuggestionsGroup = response;
      this.suggestionsFields = Object.keys(this.substanceSuggestionsGroup);
    }, error => {
      //  this.gaService.sendException('type ahead search suggestion error from API call');
      console.log(error);
    });

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  queryablePropertySelected(queryableProperty: string): void {
    this.processQueriablePropertyChange(queryableProperty);

    // Get Suggestion/TypeAhead text from file
    this.selectedQueryableSuggest = this._queryableDictionary[queryableProperty].suggest;

    if (!this._queryableDictionary[queryableProperty].cvDomain && this._queryableDictionary[queryableProperty].type === 'string') {
      //  this.commandControl.setValue('ALL of the following words in any order or position');
      this.commandControl.setValue('Contains');
    } else {
      this.commandControl.setValue(this.commandOptions[0]);
    }
  }

  private processQueriablePropertyChange(queryableProperty: string): void {
    this.selectedQueryableProperty = queryableProperty;
    if (this._queryableDictionary[queryableProperty].cvDomain) {
      this.setCvOptions(this._queryableDictionary[queryableProperty].cvDomain);
    }
    this.selectedLucenePath = this._queryableDictionary[queryableProperty].lucenePath;
    if (this.selectedLucenePath) {
      this.selectedLucenePath = this.selectedLucenePath + ':';
    }
    this.selectedQueryablePropertyType = this._queryableDictionary[queryableProperty].type;

    this.commandOptions = Object.keys(
      this.typeCommandOptions[this._queryableDictionary[queryableProperty].type]
    )
      .filter(
        option => {
          let result = false;
          //  return this._queryableDictionary[queryableProperty].cvDomain || option !== 'the following exact default values'
          // && (this.commandOptionsShowAll === false && (option === 'Contains' || option === 'Exact Match' || option === 'Starts With')));
          if (this.isShowAllCommandOptions === false) {
            if (option === 'Contains' || option === 'Exact Match' || option === 'Starts With') {
              result = true;
            } else if (this._queryableDictionary[queryableProperty].cvDomain && option === 'the following exact default values') {
              result = true;
            } else {
              result = false;
            }
          } else {
            if (this._queryableDictionary[queryableProperty].cvDomain || option !== 'the following exact default values') {
              result = true;
            }
          }
          return result;
        }
      ).sort((a, b) => {
        if (a === 'the following exact default values') {
          return -1;
        }
        if (b === 'the following exact default values') {
          return 1;
        }
        if (a.toLowerCase() < b.toLowerCase()) {
          return -1;
        }
        if (a.toLowerCase() > b.toLowerCase()) {
          return 1;
        }
        return 0;
      });
  }

  setCvOptions(cvDomain: string): void {
    this.cvService.getDomainVocabulary(cvDomain).subscribe(response => {
      this.cvOptions = response[cvDomain].list;
    });
  }

  refreshQuery(): void {
    if (this.commandInputs && this.commandInputs.length > 0) {
      this.commandOptionsExample = this.commandInputs[0].example;
    }
    this.queryParts = [];
    this.commandInputs.forEach((commandInput, index) => {
      if (this.commandInputValueDict[commandInput.type] && this.commandInputValueDict[commandInput.type][index] != null) {
        commandInput.constructQuery(
          this.commandInputValueDict[commandInput.type][index],
          this.selectedCondition,
          this.selectedQueryableProperty,
          this.selectedLucenePath,
          this.queryUpdated,
          this.queryParts
        );
      } else {
        this.queryUpdated.emit({
          condition: this.selectedCondition,
          queryableProperty: this.selectedQueryableProperty,
          command: this.selectedCommandOption,
          commandInputValues: [],
          query: ''
        });
      }
    });
  }

  queryablePropertiesAutocompleteClosed(): void {
    this.decreaseOverlayZindex();
    const inputValue = this.queryablePropertiesAutocompleteControl.value;

    if (inputValue) {
      for (let i = 0; i < this.allOptions.length; i++) {
        if (this.allOptions[i].toLowerCase() === inputValue.toLowerCase()) {
          this.queryablePropertySelected(this.allOptions[i]);
          this.queryablePropertiesAutocompleteControl.setValue(this.allOptions[i]);
          break;
        }
      }
    }

  }

  queryablePropertiesAutocompleteBlurred(): void {
    if (this.queryableOptionsAll.length === 0) {
      this.queryablePropertiesAutocompleteControl.setValue('All');
      this.queryablePropertySelected('All');
    }
  }

  clearSelectedQueryableProperty(): void {
    this.queryablePropertiesAutocompleteControl.setValue('');
  }

  showAllFields(): void {
    this.isShowCommonFields = false;
    this.queryablePropertiesAutocompleteControl.setValue(this.selectedQueryableProperty || '');
  }

  showCommonFields(): void {
    this.isShowCommonFields = true;
    if (this.queryableOptionsCommon.indexOf(this.selectedQueryableProperty) > -1) {
      this.queryablePropertiesControl.setValue(this.selectedQueryableProperty);
    } else {
      this.queryablePropertiesControl.setValue('All');
    }
  }

  showAllCommandOptions(): void {
    this.isShowAllCommandOptions = !this.isShowAllCommandOptions;
    this.processQueriablePropertyChange(this.selectedQueryableProperty);
  }

  private setCommand(command: string): void {
    this.selectedCommandOption = command;
    const commandObj = this.typeCommandOptions[this.selectedQueryablePropertyType][command] as any;
    if (commandObj.commandInputs) {
      this.commandInputs = commandObj.commandInputs;
      this.refreshQuery();
    } else if (commandObj.constructQuery) {
      this.commandInputs = [];
      commandObj.constructQuery(
        command.trim(),
        this.selectedCondition,
        this.selectedQueryableProperty,
        this.selectedLucenePath,
        this.queryUpdated,
        this.queryParts
      );
    }
  }

  processSubstanceSearch(searchValue: string) {
    this.navigateToSearchResults(searchValue);
  }

  navigateToSearchResults(searchTerm: string) {

    const navigationExtras: NavigationExtras = {
      queryParams: searchTerm ? { 'search': searchTerm } : null
    };

    this.router.navigate(['/browse-substance'], navigationExtras);
  }

  increaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = '1002';
  }

  decreaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = null;
  }

  openedChange(opened: boolean): void {
    if (opened) {
      this.increaseOverlayZindex();
    } else {
      this.decreaseOverlayZindex();
    }
  }

  searchOptionSelected(event?: MatAutocompleteSelectedEvent) {
    //  const eventCategory = this.eventCategory || 'advancedSearchTypeAheadTextSearch';
    const eventLabel = !this.configService.environment.isAnalyticsPrivate && event.option.value || 'auto-complete option';
    // this.gaService.sendEvent(eventCategory, 'select:auto-complete', eventLabel);
    let searchTerm = event.option.value;

    this.searchPerformed.emit(searchTerm);

    if (searchTerm) {
      this.queryParts = [];
      this.commandInputs.forEach((commandInput, index) => {
        //    if (this.commandInputValueDict[commandInput.type] && this.commandInputValueDict[commandInput.type][index] != null) {
        commandInput.constructQuery(
          searchTerm,
          this.selectedCondition,
          this.selectedQueryableProperty,
          this.selectedLucenePath,
          this.queryUpdated,
          this.queryParts
        );
      });
    }
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
