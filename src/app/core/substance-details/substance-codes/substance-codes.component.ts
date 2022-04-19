import {AfterViewInit, Component, OnInit} from '@angular/core';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import {SubstanceCode, SubstanceDetail, SubstanceName, TableFilterDDModel} from '../../substance/substance.model';
import {MatDialog} from '@angular/material/dialog';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {Subject} from 'rxjs';
import {Sort} from '@angular/material/sort';
import { OverlayContainer } from '@angular/cdk/overlay';
import {UtilsService} from '@gsrs-core/utils';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-substance-codes',
  templateUrl: './substance-codes.component.html',
  styleUrls: ['./substance-codes.component.scss']
})
export class SubstanceCodesComponent extends SubstanceCardBaseFilteredList<SubstanceCode> implements OnInit, AfterViewInit {
  type: string;
  codes: Array<SubstanceCode> = [];
  displayedColumns: string[];
  substanceUpdated = new Subject<SubstanceDetail>();
  hideFilters = true;
  showHideFilterText = 'Show Filter';
  displayedFilterColumns: string[];
  codeSystemFilter = new FormControl();
  typeFilter = new FormControl();
  codeFilter = new FormControl();
  typeFilterOptions: Array<TableFilterDDModel> = [];
  private overlayContainer: HTMLElement;

  constructor(
    private dialog: MatDialog,
    public gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer,
    private utilsService: UtilsService
  ) {
    super(gaService);
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      this.codes = [];
      if (this.substance != null && this.type != null) {
        if (this.type === 'Codes - classification') {
          this.displayedColumns = ['classificationTree', 'codeSystem', 'code', 'references'];
          //this.displayedFilterColumns = ['classTreeFilter', 'codeSystemFilter', 'codeFilter', 'emptyFilter', 'resetFilter'];
        } else {
          this.displayedColumns = ['codeSystem', 'code', 'type', 'comments', 'references'];
          this.displayedFilterColumns = ['codeSystemFilter', 'codeFilter', 'typeFilter', 'emptyFilter', 'resetFilter'];
        }

          this.filterSubstanceCodes();

        if (this.codes != null && this.codes.length) {
          this.codes.forEach(code => {
            if (code.url) {
              code.url = code.url.trim();
            }
          });
          this.filtered = this.codes;
          this.pageChange();

          this.searchControl.valueChanges.subscribe(value => {
            this.filterList(value, this.codes);
          }, error => {
            console.log(error);
          });
          this.getTypeFilterOptions();
        } else {
          this.filtered = [];
        }
      }
    });

  //  if (this.type === 'identifiers') {
      this.pageSize = 10;
  //  }
    
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.codeSystemFilter.valueChanges.subscribe((codeSystemFilterValue) => {
      this.filterTable();
    });
    this.codeFilter.valueChanges.subscribe((codeFilterValue) => {
      this.filterTable();
    });
    this.typeFilter.valueChanges.subscribe((typeFilterValue) => {
      this.filterTable();
    });
  }

  filterTable(type?:string) {
    const csFilter = this.codeSystemFilter.value === null ? '' : this.codeSystemFilter.value;
    const cFilter = this.codeFilter.value === null ? '' : this.codeFilter.value;
    const tFilter = this.typeFilter.value === null ? '' : this.typeFilter.value;
    this.filtered = [];
    for(let n of this.codes) {
      if((n.codeSystem.toLowerCase().includes(csFilter.toLowerCase())) &&
      (n.code.toLowerCase().includes(cFilter.toLowerCase())) &&
      (n.type.toLowerCase().includes(tFilter.toLowerCase()))) {
        this.filtered.push(n);
      }
    }
    
    this.pageChange();
  }

  toggleFilter() {
    this.hideFilters = !this.hideFilters;
    if(this.hideFilters) {
      this.showHideFilterText = 'Show Filter';
    } else {
      this.showHideFilterText = 'Hide Filter';
    }
  }

  getTypeFilterValue(value) {
    for(let l of this.typeFilterOptions) {
      if(l.display === value) {
        return l;
      }
    }
  }

  getTypeFilterOptions() {
    for(let n of this.codes) {
        let oneType = n.type;
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

  sortData(sort: Sort) {
    const data = this.codes.slice();
    if (!sort.active || sort.direction === '') {
      this.filtered = data;
      this.pageChange();
      return;
    }
    this.filtered = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.utilsService.compare(a[sort.active] ? a[sort.active] : null, b[sort.active] ? b[sort.active] : null, isAsc);
    });
    this.pageChange();

    
  }

  ngAfterViewInit(): void {
  }

  private filterSubstanceCodes(): void {
    if (this.substance.codes && this.substance.codes.length > 0) {
      this.substance.codes.forEach(code => {
        if (code._isClassification && this.type === 'Codes - Classifications') {
          this.codes.push(code);
        } else if (!code._isClassification && this.type === 'Codes - Identifiers') {
          this.codes.push(code);
        }
      });
      this.countUpdate.emit(this.codes.length);
    }
  }

  getClassificationTree(comments: string): Array<string> {
    return comments.split('|');
  }

  resetFilters() {
    this.pageChange();
    this.searchControl.setValue('');
    this.codeFilter.setValue('');
    this.codeSystemFilter.setValue('');
    this.typeFilter.setValue('');
  }

  openModal(templateRef) {

    this.gaService.sendEvent(this.analyticsEventCategory, 'button', 'references view');

    const dialogRef = this.dialog.open(templateRef, {
      minWidth: '40%',
      maxWidth: '90%'
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }
}

