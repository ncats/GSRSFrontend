import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { QueryableSubstanceDictionary } from '../queryable-substance-dictionary.model';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  selector: 'app-query-statement',
  templateUrl: './query-statement.component.html',
  styleUrls: ['./query-statement.component.scss']
})
export class QueryStatementComponent implements OnInit, OnDestroy {
  @Input() index: number;
  @Input() queryableDictionary: QueryableSubstanceDictionary;
  private allOptions: Array<string>;
  options: Array<string>;
  queryablePropertiesControl = new FormControl();
  private subscriptions: Array<Subscription> = [];
  conditionOptions = [
    'AND',
    'OR',
    'NOT'
  ];

  commandOptions: Array<any>;

  private typeCommandOptions = {
    string: [
      {
        value: 'any',
        display: 'terms'
      },
      {
        value: 'exact',
        display: 'exact phrase'
      },
      {
        value: 'contain',
        display: 'terms that contain'
      },
      {
        value: 'beginsWith',
        display: 'terms that begin with'
      },
      {
        value: 'endsWith',
        display: 'terms that end with'
      }
    ],
    timestamp: [
      {
        value: 'on',
        display: 'on'
      },
      {
        value: 'before',
        display: 'before'
      },
      {
        value: 'after',
        display: 'after'
      },
      {
        value: 'between',
        display: 'between'
      }
    ],
    boolean: [
      {
        value: true,
        display: 'true'
      },
      {
        value: false,
        display: 'false'
      }
    ],
    number: [
      {
        value: 'exact',
        display: 'exact number'
      },
      {
        value: 'beginsWith',
        display: 'number that begins with'
      },
      {
        value: 'endsWith',
        display: 'number that ends with'
      },
      {
        value: 'between',
        display: 'between'
      }
    ]
  };

  constructor() { }

  ngOnInit() {
    const subscription = this.queryablePropertiesControl.valueChanges.subscribe(value => {
      this.options = this.allOptions.filter(option => {
        return option.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });
    });
    this.subscriptions.push(subscription);
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
    console.log(queryableProperty.option.value);
    this.commandOptions = this.typeCommandOptions[this.queryableDictionary[queryableProperty.option.value].type];
    console.log(this.commandOptions);
  }
}
