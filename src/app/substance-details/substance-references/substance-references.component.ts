import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import { SubstanceReference } from '../../substance/substance.model';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import { PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-substance-references',
  templateUrl: './substance-references.component.html',
  styleUrls: ['./substance-references.component.scss']
})
export class SubstanceReferencesComponent extends SubstanceCardBaseFilteredList<SubstanceReference> implements OnInit {
  references: Array<SubstanceReference>;
  displayedColumns: string[] = ['citation', 'type', 'tags', 'dateAcessed'];

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.substance != null && this.substance.references != null) {
      this.references = this.substance.references;
      this.filtered = this.substance.references;
      this.pageChange();

      this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.references);
      }, error => {
        console.log(error);
      });
    }
  }

}
