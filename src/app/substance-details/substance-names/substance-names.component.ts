import { Component, OnInit } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import { SubstanceName } from '../../substance/substance.model';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-substance-names',
  templateUrl: './substance-names.component.html',
  styleUrls: ['./substance-names.component.scss']
})
export class SubstanceNamesComponent extends SubstanceCardBaseFilteredList<SubstanceName> implements OnInit {
  names: Array<SubstanceName>;
  displayedColumns: string[] = ['name', 'type', 'language'];

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.substance != null && this.substance.names != null) {
      this.names = this.substance.names;
      this.filtered = this.substance.names;
      this.pageChange();

      this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.names);
      }, error => {
        console.log(error);
      });
    }
  }

}
