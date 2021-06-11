import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { QueryableSubstanceDictionary, CommandInput, Command } from '@gsrs-core/guided-search/queryable-substance-dictionary.model';
import { FormControl } from '@angular/forms';
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
import { ApplicationService } from '../../application/service/application.service';
import { ProductService } from '../../product/service/product.service';
import { ClinicalTrialService } from '../../clinical-trials/clinical-trial/clinical-trial.service';
import { AdvancedSearchService } from '../service/advanced-search.service';

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
  categoryOptions = [
    'Application',
    'Product',
    'Clinical Trial'
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
    //  alert('this' + this.queryStatementHash);
      const queryStatementString = localStorage.getItem(this.queryStatementHash.toString());
    //  alert('HASH' + queryStatementString);
      if (queryStatementString) {
        queryStatement = JSON.parse(queryStatementString);
      }
    }

    if (queryStatement != null) {
   //   alert(JSON.stringify(queryStatement));
   //   alert(JSON.stringify(queryStatement.queryableProperty));
   //   alert('FILE ' + JSON.stringify(this._queryableDictionary));
   //   alert('QUERY PROPERTY ' + queryStatement.queryableProperty);
  //    alert('GGG' + JSON.stringify(this._queryableDictionary[queryStatement.queryableProperty]));
      const queryablePropertyType = this._queryableDictionary[queryStatement.queryableProperty].type;
  //    alert(queryablePropertyType);
      let inputType: string;
      const commandObject = typeCommandOptions[queryablePropertyType][queryStatement.command] as Command;
      if (commandObject.commandInputs) {
  //      alert(JSON.stringify(commandObject));
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

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  private loadFileName() {
    if (this.category) {
      this.query = '';
      this.facetManagerService.clearSelections();
      this.facetManagerService.unregisterFacetSearchHandler();

      if (this.category === 'Substance') {
        this.dictionaryFileName = 'substance_dictionary.json';
        this.facetManagerService.registerGetFacetsHandler(this.substanceService.getSubstanceFacets);
     //   this.rawFacets = this.rawFacetsSubstance;
     //   this.facetKey = 'substances';
      } else if (this.category === 'Application') {
        this.dictionaryFileName = 'application_dictionary.json';
        this.facetManagerService.registerGetFacetsHandler(this.applicationService.getApplicationFacets);
     //   this.rawFacets = this.rawFacetsApplication;
     //   this.facetKey = 'applications';
      } else if (this.category === 'Product') {
        this.dictionaryFileName = 'product_dictionary.json';
        this.facetManagerService.registerGetFacetsHandler(this.productService.getProductFacets);
     //   this.rawFacets = this.rawFacetsProduct;
     //   this.facetKey = 'products';
      } else if (this.category === 'Clinical Trial') {
        this.dictionaryFileName = 'clinicaltrial_dictionary.json';
        this.facetManagerService.registerGetFacetsHandler(this.clinicalTrialService.getClinicalTrialsFacets);
     //   this.rawFacets = this.rawFacetsClinicalTrial;
     //   this.facetKey = 'ctclinicaltrial';
      } else if (this.category === 'Adverse Event') {
        this.dictionaryFileName = 'adverseevent_dictionary.json';
        // this.rawFacets.length = 0;
     //   this.rawFacets.splice(0, this.rawFacets.length);
      }
    }
    this.getSearchField();
  }

  getSearchField() {
    // const url = `${this.configService.environment.baseHref}assets/data/` + this.dictionaryFileName;
    this.http.get(`${this.configService.environment.baseHref}assets/data/` + this.dictionaryFileName)
      .subscribe((response: QueryableSubstanceDictionary) => {

        response['All'] = {
          lucenePath: 'text',
          description: 'All fields',
          type: 'string',
          cvDomain: ''
        };
        this.queryableSubstanceDict = response;
        // console.log(JSON.stringify('AAAA ' + this.queryableSubstanceDict));

        const displayProperties = ['All'];
        const displayPropertiesCommon = ['All'];
        Object.keys(this.queryableSubstanceDict).forEach(key => {
          displayProperties.push(key);
          if (this.queryableSubstanceDict[key].priority != null) {
            displayPropertiesCommon.push(key);
          }
        });
        this.displayProperties = displayProperties;
        this.searchFields = displayPropertiesCommon;

        /*
        if (queryStatementHashes != null) {
          queryStatementHashes.forEach(queryStatementHash => {
            this.queryStatements.push({ queryHash: queryStatementHash });
          });
        } else {
          this.queryStatements.push({});
        }
        */
        this.queryStatements.push({});
      });

    // this.searchFields = this.displayPropertiesCommon;

    //  console.log(JSON.stringify(this.displayPropertiesCommon));
  }

  private loadSearchField() {
    if (this.categoryinput) {
      // Empty current SearchField Array
      // this.searchFields.splice(0, this.searchFields.length);
      if (this.categoryinput === 'Substance') {
        this.dictionaryFileName = 'substance_dictionary.json';
      } else if (this.categoryinput === 'Application') {
        this.dictionaryFileName = 'application_dictionary.json';
      } else if (this.categoryinput === 'Product') {
        this.dictionaryFileName = 'product_dictionary.json';
      } else if (this.categoryinput === 'Clinical Trial') {
        this.dictionaryFileName = 'clinicaltrial_dictionary.json';
      }
    }
    this.getSearchField();
  }

  queryablePropertySelected(queryableProperty: string): void {
    this.processQueriablePropertyChange(queryableProperty);
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

}
