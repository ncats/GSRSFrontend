import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { QueryableSubstanceDictionary, CommandInput, Command } from '../queryable-substance-dictionary.model';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { typeCommandOptions, inputTypes } from './type-command-options.constant';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ControlledVocabularyService, VocabularyTerm } from '@gsrs-core/controlled-vocabulary';
import { QueryStatement } from './query-statement.model';

@Component({
  selector: 'app-query-statement',
  templateUrl: './query-statement.component.html',
  styleUrls: ['./query-statement.component.scss']
})
export class QueryStatementComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() queryStatementHash?: number;
  @Input() queryableOptionsCommon: Array<string>;
  private _index = 0;
  private _queryableDictionary: QueryableSubstanceDictionary;
  @Output() queryUpdated = new EventEmitter<QueryStatement>();
  private allOptions: Array<string>;
  queryableOptionsAll: Array<string>;
  queryablePropertiesControl = new FormControl();
  queryablePropertiesAutocompleteControl = new FormControl();
  commandControl = new FormControl();
  private subscriptions: Array<Subscription> = [];
  conditionOptions = [
    'AND',
    'OR',
    'NOT'
  ];
  conditionControl = new FormControl();
  selectedCondition = '';
  selectedQueryableProperty: string;
  selectedQueryablePropertyType: string;
  selectedLucenePath: string;
  commandOptions: Array<string>;
  selectedCommandOption: string;
  commandInputs: Array<CommandInput>;
  queryParts: Array<string> = [];
  private typeCommandOptions = typeCommandOptions;
  commandInputValueDict: {[queryablePropertyType: string]: Array<string | Date | number> } = {};
  private overlayContainer: HTMLElement;
  cvOptions: Array<VocabularyTerm>;
  isShowCommonFields = true;

  constructor(
    private overlayContainerService: OverlayContainer,
    public cvService: ControlledVocabularyService
  ) {}

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

    let queryStatement: QueryStatement;

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

  @Input()
  set queryableDictionary(queryableSubstanceDictionary: QueryableSubstanceDictionary) {
    if (queryableSubstanceDictionary != null) {
      this._queryableDictionary  = queryableSubstanceDictionary;
    }
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

  @Input()
  set queryableOptions(options: Array<string>) {
    this.allOptions = options;
    this.queryableOptionsAll = options;
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
        command,
        this.selectedCondition,
        this.selectedQueryableProperty,
        this.selectedLucenePath,
        this.queryUpdated,
        this.queryParts
      );
    }
  }

  queryablePropertySelected(queryableProperty: string): void {
    this.processQueriablePropertyChange(queryableProperty);
    this.commandControl.setValue(this.commandOptions[0]);
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

  increaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = '1002';
  }

  decreaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = null;
  }
}
