import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { QueryableSubstanceDictionary } from '../queryable-substance-dictionary.model';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatDatepickerInputEvent } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-query-statement',
  templateUrl: './query-statement.component.html',
  styleUrls: ['./query-statement.component.scss']
})
export class QueryStatementComponent implements OnInit, OnDestroy {
  @Input() index = 0;
  @Input() queryableDictionary: QueryableSubstanceDictionary;
  @Output() queryUpdated = new EventEmitter<string>();
  private allOptions: Array<string>;
  options: Array<string>;
  queryablePropertiesControl = new FormControl();
  commandControl = new FormControl();
  private subscriptions: Array<Subscription> = [];
  conditionOptions = [
    'AND',
    'OR',
    'NOT'
  ];
  conditionControl = new FormControl();
  private selectedCondition = '';
  private selectedLucenePath: string;
  private selectedQueryablePropertyType: string;
  commandOptions: Array<string>;
  commandInputs: Array<any>;
  private query: string;
  private queryParts: Array<string> = [];

  private typeCommandOptions = {
    string: {
      'any of these words': {
        commandInputs: [
          {
            type: 'text',
            constructQuery: (queryValue: string) => {
              const parts = queryValue.split(' ');
              let query = parts.map(word => {
                return this.selectedLucenePath + word;
              }).join(' OR ');
              if (parts.length > 1) {
                query = `(${query})`;
              }
              this.query = `${this.selectedCondition}${query}`;
              this.queryUpdated.emit(this.query);
            },
            value: ''
          }
        ]
      },
      'exact phrase': {
        commandInputs: [
          {
            type: 'text',
            constructQuery: (queryValue: string) => {
              this.query = `${this.selectedCondition}${this.selectedLucenePath}"^${queryValue}$"`;
              this.queryUpdated.emit(this.query);
            },
            value: ''
          }
        ]
      },
      'terms that contain': {
        commandInputs: [
          {
            type: 'text',
            constructQuery: (queryValue: string) => {
              this.query = `${this.selectedCondition}${this.selectedLucenePath}"${queryValue}"`;
              this.queryUpdated.emit(this.query);
            },
            value: ''
          }
        ]
      },
      'terms that begin with': {
        commandInputs: [
          {
            type: 'text',
            constructQuery: (queryValue: string) => {
              this.query = `${this.selectedCondition}${this.selectedLucenePath}"^${queryValue}*"`;
              this.queryUpdated.emit(this.query);
            },
            value: ''
          }
        ]
      },
      'terms that end with': {
        commandInputs: [
          {
            type: 'text',
            constructQuery: (queryValue: string) => {
              this.query = `${this.selectedCondition}${this.selectedLucenePath}"*${queryValue}"`;
              this.queryUpdated.emit(this.query);
            },
            value: ''
          }
        ]
      }
    },
    timestamp: {
      'on': {
        commandInputs: [
          {
            type: 'datetime',
            constructQuery: (datepickerEvent: MatDatepickerInputEvent<Date>) => {
              const timestampStart = moment(datepickerEvent.value)
                .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utc().valueOf();
              const timestampEnd = moment(datepickerEvent.value)
                .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).utc().valueOf();
              this.query = `${this.selectedCondition}${this.selectedLucenePath}[${timestampStart} TO ${timestampEnd}]`;
              this.queryUpdated.emit(this.query);
            },
            value: ''
          }
        ]
      },
      'before': {
        commandInputs: [
          {
            type: 'datetime',
            constructQuery: (datepickerEvent: MatDatepickerInputEvent<Date>) => {
              const timestampEnd = moment(datepickerEvent.value)
                .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).utc().valueOf();
              this.query = `${this.selectedCondition}${this.selectedLucenePath}[-10E50 TO ${timestampEnd}]`;
              this.queryUpdated.emit(this.query);
            },
            value: ''
          }
        ]
      },
      'after': {
        commandInputs: [
          {
            type: 'datetime',
            constructQuery: (datepickerEvent: MatDatepickerInputEvent<Date>) => {
              const timestampStart = moment(datepickerEvent.value)
                .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utc().valueOf();
              this.query = `${this.selectedCondition}${this.selectedLucenePath}[${timestampStart} TO 10E50]`;
              this.queryUpdated.emit(this.query);
            },
            value: ''
          }
        ]
      },
      'between': {
        commandInputs: [
          {
            type: 'datetime',
            constructQuery: (datepickerEvent: MatDatepickerInputEvent<Date>) => {
              const timestampStart = moment(datepickerEvent.value)
                .set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).utc().valueOf();

              this.queryParts[0] = `${this.selectedCondition}${this.selectedLucenePath}[${timestampStart} TO `;
              this.query = this.queryParts.join('');
              this.queryUpdated.emit(this.query);
            },
            value: ''
          },
          {
            type: 'datetime',
            constructQuery: (datepickerEvent: MatDatepickerInputEvent<Date>) => {
              const timestampEnd = moment(datepickerEvent.value)
                .set({ hour: 23, minute: 59, second: 59, millisecond: 999 }).utc().valueOf();
              this.queryParts[1] = `${timestampEnd}]`;
              this.query = this.queryParts.join('');
              this.queryUpdated.emit(this.query);
            },
            value: ''
          }
        ]
      }
    },
    boolean: {
      'true': {
        constructQuery: (commandValue: string) => {
          this.query = `${this.selectedCondition}${this.selectedLucenePath}"^${commandValue}$"`;
          this.queryUpdated.emit(this.query);
        },
        value: ''
      },
      'false': {
        constructQuery: (commandValue: string) => {
          this.query = `${this.selectedCondition}${this.selectedLucenePath}"^${commandValue}$"`;
          this.queryUpdated.emit(this.query);
        },
        value: ''
      }
    },
    number: {
      'exact number': {
        commandInputs: [
          {
            type: 'number',
            constructQuery: (queryValue: number) => {
              this.query = `${this.selectedCondition}${this.selectedLucenePath}${queryValue}`;
              this.queryUpdated.emit(this.query);
            },
            value: ''
          }
        ]
      },
      'number that begins with': {
        commandInputs: [
          {
            type: 'number',
            constructQuery: (queryValue: number) => {
              this.query = `${this.selectedCondition}${this.selectedLucenePath}[${queryValue} TO 10E50]`;
              this.queryUpdated.emit(this.query);
            },
            value: ''
          }
        ]
      },
      'number that ends with': {
        commandInputs: [
          {
            type: 'number',
            constructQuery: (queryValue: number) => {
              this.query = `${this.selectedCondition}${this.selectedLucenePath}[-10E50 TO ${queryValue}]`;
              this.queryUpdated.emit(this.query);
            },
            value: ''
          }
        ]
      },
      'between': {
        commandInputs: [
          {
            type: 'number',
            constructQuery: (queryValue: number) => {
              this.queryParts[0] = `${this.selectedCondition}${this.selectedLucenePath}[${queryValue} TO `;
              this.query = this.queryParts.join('');
              this.queryUpdated.emit(this.query);
            },
            value: ''
          },
          {
            type: 'number',
            constructQuery: (queryValue: number) => {
              this.queryParts[1] = `${queryValue}]`;
              this.query = this.queryParts.join('');
              this.queryUpdated.emit(this.query);
            },
            value: ''
          }
        ]
      }
    }
  };

  constructor() { }

  ngOnInit() {
    this.queryablePropertiesControl.setValue('All');
    this.selectedLucenePath = '';
    this.commandOptions = Object.keys(this.typeCommandOptions.string);
    this.commandControl.setValue('any');
    const subscription = this.queryablePropertiesControl.valueChanges.subscribe(value => {
      this.options = this.allOptions.filter(option => {
        return option.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });
    });
    this.subscriptions.push(subscription);
    this.commandControl.setValue(this.commandOptions[0]);
    this.selectedQueryablePropertyType = 'string';
    this.commandInputs = this.typeCommandOptions['string']['any of these words'].commandInputs;
    const commandSubscription = this.commandControl.valueChanges.subscribe((command: string) => {
      if (this.typeCommandOptions[this.selectedQueryablePropertyType][command].commandInputs) {
        this.commandInputs = this.typeCommandOptions[this.selectedQueryablePropertyType][command].commandInputs;
        this.refreshQuery();
      } else if (this.typeCommandOptions[this.selectedQueryablePropertyType][command].constructQuery) {
        this.commandInputs = [];
        this.typeCommandOptions[this.selectedQueryablePropertyType][command].constructQuery(command);
      }
    });
    this.subscriptions.push(commandSubscription);
    if (this.index > 0) {
      this.conditionControl.setValue('AND');
      this.selectedCondition = 'AND ';
      const conditionSubscription = this.conditionControl.valueChanges.subscribe((condition: string) => {
        this.selectedCondition = `${condition} `;
      });
      this.subscriptions.push(conditionSubscription);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  @Input()
  set queryableOptions(options: Array<string>) {
    this.allOptions = options;
    this.options = options;
  }

  queryablePropertySelected(queryableProperty: MatAutocompleteSelectedEvent) {
    this.selectedLucenePath = this.queryableDictionary[queryableProperty.option.value].lucenePath;
    if (this.selectedLucenePath) {
      this.selectedLucenePath = this.selectedLucenePath + ':';
    }
    this.selectedQueryablePropertyType = this.queryableDictionary[queryableProperty.option.value].type;
    this.commandOptions = Object.keys(this.typeCommandOptions[this.queryableDictionary[queryableProperty.option.value].type]);
    this.commandControl.setValue(this.commandOptions[0]);
  }

  refreshQuery(): void {
    this.queryParts = [];
    this.commandInputs.forEach(commandInput => {
      if (commandInput.value != null) {
        commandInput.constructQuery(commandInput.value);
      }
    });
  }
}
