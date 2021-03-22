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
import { UtilsService } from '@gsrs-core/utils';

@Component({
  selector: 'app-advanced-query-statement',
  templateUrl: './advanced-query-statement.component.html',
  styleUrls: ['./advanced-query-statement.component.scss']
})

export class AdvancedQueryStatementComponent implements OnInit {

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

  /*
  commandOptions = [
    'Exact Match',
    'Contains',
    'Starts With'
  ];
  */
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
     // alert('UUUU ' + JSON.stringify(queryableSubstanceDictionary));
      this._queryableDictionary = queryableSubstanceDictionary;
     // alert("YYYY " + JSON.stringify(this._queryableDictionary));
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
    //  alert(command);
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

  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getSearchField() {
    const url = `${this.configService.environment.baseHref}assets/data/` + this.dictionaryFileName;
    // alert(url);
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
      }
      if (this.categoryinput === 'Application') {
        this.dictionaryFileName = 'application_dictionary.json';
      }
      else if (this.categoryinput === 'Product') {
        this.dictionaryFileName = 'product_dictionary.json';
      }
      else if (this.categoryinput === 'Clinical Trial') {
        this.dictionaryFileName = 'clinicaltrial_dictionary.json';
      }
    }
    this.getSearchField();
  }

  queryablePropertySelected(queryableProperty: string): void {
   // alert('GGGGG ' + queryableProperty);
   // alert(JSON.stringify(this._queryableDictionary));
    this.processQueriablePropertyChange(queryableProperty);
    if (!this._queryableDictionary[queryableProperty].cvDomain && this._queryableDictionary[queryableProperty].type === 'string') {
    //  alert('AAAAAAAA');
      this.commandControl.setValue('ALL of the following words in any order or position');
    } else {
      this.commandControl.setValue(this.commandOptions[0]);
    }
  }

  private processQueriablePropertyChange(queryableProperty: string): void {
  //  alert('in process');
   // alert(JSON.stringify(this._queryableDictionary));
    this.selectedQueryableProperty = queryableProperty;

    if (this._queryableDictionary[queryableProperty].cvDomain) {
      this.setCvOptions(this._queryableDictionary[queryableProperty].cvDomain);
    }
    this.selectedLucenePath = this._queryableDictionary[queryableProperty].lucenePath;
  //  alert(this.selectedLucenePath);
    if (this.selectedLucenePath) {
      this.selectedLucenePath = this.selectedLucenePath + ':';
    }
    this.selectedQueryablePropertyType = this._queryableDictionary[queryableProperty].type;
    this.commandOptions = Object.keys(
      this.typeCommandOptions[this._queryableDictionary[queryableProperty].type]
    ).filter(option => {
      return this._queryableDictionary[queryableProperty].cvDomain || option !== 'the following exact default values';
    }).sort((a, b) => {
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
