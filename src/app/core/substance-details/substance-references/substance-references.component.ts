import { Component, OnInit } from '@angular/core';
import {SubstanceDetail, SubstanceReference} from '../../substance/substance.model';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {Subject} from 'rxjs';
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'app-substance-references',
  templateUrl: './substance-references.component.html',
  styleUrls: ['./substance-references.component.scss']
})
export class SubstanceReferencesComponent extends SubstanceCardBaseFilteredList<SubstanceReference> implements OnInit {
  references: Array<SubstanceReference> = [];
  displayedColumns: string[] = ['citation', 'type', 'tags', 'dateAcessed'];
  substanceUpdated = new Subject<SubstanceDetail>();

  constructor(
    public gaService: GoogleAnalyticsService
  ) {
    super(
      gaService
    );
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null && this.substance.references != null) {
        this.references = this.substance.references;
        this.filtered = this.substance.references;
        this.pageChange();

        this.searchControl.valueChanges.subscribe(value => {
          this.filterList(value, this.references, this.analyticsEventCategory);
        }, error => {
          console.log(error);
        });
      }
      this.countUpdate.emit(this.references.length);
    });

  }

  sortData(sort: Sort) {
    const data = this.references.slice();
    if (!sort.active || sort.direction === '') {
      this.filtered = data;
      this.pageChange();
      return;
    }
    this.filtered = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return compare(a[sort.active].toUpperCase, b[sort.active].toUpperCase, isAsc);
    });
    this.pageChange();
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
