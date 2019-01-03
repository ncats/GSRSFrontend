import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import { SubstanceName } from '../../substance/substance.model';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
import { ValueTransformer } from '../../../../node_modules/@angular/compiler/src/util';

@Component({
  selector: 'app-substance-names',
  templateUrl: './substance-names.component.html',
  styleUrls: ['./substance-names.component.scss']
})
export class SubstanceNamesComponent extends SubstanceCardBase implements OnInit {
  names: Array<SubstanceName>;
  filteredNames: Array<SubstanceName>;
  pagedNames: Array<SubstanceName>;
  displayedColumns: string[] = ['name', 'type', 'language'];
  page = 0;
  pageSize = 5;
  searchControl = new FormControl();
  private searchTimer: any;

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.substance != null && this.substance.names != null) {
      this.names = this.substance.names;
      this.filteredNames = this.substance.names;
      this.pageChange();

      this.searchControl.valueChanges.subscribe(value => {
        this.filterNames(value);
      }, error => {
        console.log(error);
      });
    }
  }

  pageChange(pageEvent?: PageEvent): void {
    if (pageEvent != null) {
      this.page = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
    }
    this.pagedNames = [];
    const startIndex = this.page * this.pageSize;
    for (let i = startIndex; i < (startIndex + this.pageSize); i++) {
      if (this.filteredNames[i] != null) {
        this.pagedNames.push(this.filteredNames[i]);
      } else {
        break;
      }
    }
  }

  filterNames(searchInput: string): void {
    if (this.searchTimer != null) {
      clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {
      this.filteredNames = [];
      this.names.forEach(name => {
        const keys = Object.keys(name);
        let contains = false;
        for (let i = 0; i < keys.length; i++) {
          if (name[keys[i]].toString().toLowerCase().indexOf(searchInput.toLowerCase()) > -1) {
            contains = true;
            break;
          }
        }
        if (contains) {
          this.filteredNames.push(name);
        }
      });
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
      this.page = 0;
      this.pageChange();
    }, 700);
  }

}
