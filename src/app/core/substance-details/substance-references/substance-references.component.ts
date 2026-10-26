import { Component, OnInit } from '@angular/core';
import {SubstanceDetail, SubstanceReference, TableFilterDDModel} from '../../substance/substance.model';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {Subject} from 'rxjs';
import {Sort} from '@angular/material/sort';
import {UtilsService} from '@gsrs-core/utils';
import { FormControl } from '@angular/forms';
import { ConfigService } from '@gsrs-core/config';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-substance-references',
    templateUrl: './substance-references.component.html',
    styleUrls: ['./substance-references.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIconModule, MatTooltipModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, MatButtonModule]
})
export class SubstanceReferencesComponent extends SubstanceCardBaseFilteredList<SubstanceReference> implements OnInit {
  references: Array<SubstanceReference> = [];
  displayedColumns: string[] = ['citation', 'docType', 'tags', 'files', 'access'];
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
  pageSizeOptions = [5, 10, 25, 100];

  constructor(
    public gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
    private configService: ConfigService
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

    if (this.configService && this.configService.configData && this.configService.configData.editPagingOptionSettings && this.configService.configData.editPagingOptionSettings.references ){
      let pagingSettings = this.configService.configData.editPagingOptionSettings.references;
      if(pagingSettings.pageSizeDefault) {
        this.pageSize = pagingSettings.pageSizeDefault
      }
      if(pagingSettings.pageSizeOptions) {
        this.pageSizeOptions = pagingSettings.pageSizeOptions;
      }
}
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
      return this.utilsService.compare(a[sort.active] ? a[sort.active].toString().toUpperCase() : null, b[sort.active] ? b[sort.active].toString().toUpperCase() : null, isAsc);
    });
    this.pageChange();
  }

}

