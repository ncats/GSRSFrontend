import { Component, OnInit } from '@angular/core';
import {SubstanceDetail, SubstanceReference, TableFilterDDModel} from '../../substance/substance.model';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {Subject} from 'rxjs';
import {Sort} from '@angular/material/sort';
import {UtilsService} from '@gsrs-core/utils';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-substance-references',
  templateUrl: './substance-references.component.html',
  styleUrls: ['./substance-references.component.scss']
})
export class SubstanceReferencesComponent extends SubstanceCardBaseFilteredList<SubstanceReference> implements OnInit {
  references: Array<SubstanceReference> = [];
  displayedColumns: string[] = ['citation', 'type', 'tags', 'files', 'access'];
  substanceUpdated = new Subject<SubstanceDetail>();
  pageSize = 10;
  hideFilters = true;
  showHideFilterText = 'Show Filter';
  displayedFilterColumns: string[] = ['citationFilter', 'typeFilter', 'tagsFilter', 'resetFilter'];
  citationFilter = new FormControl();
  typeFilter = new FormControl();
  tagsFilter = new FormControl();
  typeFilterOptions: Array<TableFilterDDModel> = [];
  tagsFilterOptions: Array<TableFilterDDModel> = [];

  constructor(
    public gaService: GoogleAnalyticsService,
    private utilsService: UtilsService
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
        this.getFilterOptions('tags');
        this.getFilterOptions('type');
      }
      this.countUpdate.emit(this.references.length);
    });
    this.citationFilter.valueChanges.subscribe((citationFilterValue) => {
      this.filterTable();
    });
    this.typeFilter.valueChanges.subscribe((typeFilterValue) => {
      this.filterTable();
    });
    this.tagsFilter.valueChanges.subscribe((tagsFilterValue) => {
      this.filterTable();
    });
  }

  filterTable(type?:string) {
    const cFilter = this.citationFilter.value === null ? '' : this.citationFilter.value;
    const tgFilter = this.tagsFilter.value === null ? '' : this.tagsFilter.value;
    const tFilter = this.typeFilter.value === null ? '' : this.typeFilter.value;
    this.filtered = [];
    for(let n of this.references) {
      if((n.citation.toLowerCase().includes(cFilter.toLowerCase())) &&
      (n.docType.toLowerCase().includes(tFilter.toLowerCase())) && 
      (this.isIncluded(n, tgFilter))) {
        this.filtered.push(n);
      }
    }
    
    this.pageChange();
  }

  isIncluded(name, value) {
    if(value.length > 0) {
      if(name.tags.includes(value)) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  getFilterOptions(string) {
    for(let n of this.references) {
        if(string === 'tags') {
          for(let t of n.tags) {
            let oneTag = t;
            let val: TableFilterDDModel = {
              value: oneTag,
              display: oneTag
            }
            if (this.tagsFilterOptions.filter(e => e.value === oneTag).length > 0) {
            } else {
              this.tagsFilterOptions.push(val);
            }
          }
        } else if(string === 'type') {
          let oneType = n.docType;
          let value: TableFilterDDModel = {
            value: oneType,
            display: oneType
          }
          if (this.typeFilterOptions.filter(e => e.value === oneType).length > 0) {
          } else {
            this.typeFilterOptions.push(value);
          }
        }
    }
  }

  toggleFilter() {
    this.hideFilters = !this.hideFilters;
    if(this.hideFilters) {
      this.showHideFilterText = 'Show Filter';
    } else {
      this.showHideFilterText = 'Hide Filter';
    }
  }

  resetFilters() {
    this.pageChange();
    this.searchControl.setValue('');
    this.citationFilter.setValue('');
    this.tagsFilter.setValue('');
    this.typeFilter.setValue('');
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
      return this.utilsService.compare(a[sort.active] ? a[sort.active].toUpperCase : '', b[sort.active] ? b[sort.active].toUpperCase : '', isAsc);
    });
    this.pageChange();
  }

}

