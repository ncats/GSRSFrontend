import {Component, OnInit, AfterViewInit} from '@angular/core';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import {SubstanceDetail, SubstanceName, TableFilterDDModel} from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import {MatDialog} from '@angular/material/dialog';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {Subject} from 'rxjs';
import {Sort} from '@angular/material/sort';
import { OverlayContainer } from '@angular/cdk/overlay';
import {UtilsService} from '@gsrs-core/utils';
import { FormControl } from '@angular/forms';
import { throws } from 'assert';
import { I } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-substance-names',
  templateUrl: './substance-names.component.html',
  styleUrls: ['./substance-names.component.scss']
})
export class SubstanceNamesComponent extends SubstanceCardBaseFilteredList<SubstanceName> implements OnInit {
  names: Array<SubstanceName>;
  displayedColumns: string[] = ['name', 'type', 'language', 'details', 'references'];
  displayedFilterColumns: string[] = ['nameFilter', 'typeFilter', 'languageFilter', 'emptyFilter', 'resetFilter'];
  languageVocabulary: { [vocabularyTermValue: string]: VocabularyTerm } = {};
  typeVocabulary: { [vocabularyTermValue: string]: VocabularyTerm } = {};
  substanceUpdated = new Subject<SubstanceDetail>();
  private overlayContainer: HTMLElement;
  hideOrgs = true;
  pageSize = 10;
  uniqueVals: Array<string>;
  filterSelectObj = [];
  filterBackup: Array<any>;
  typeFilterOn = 'false';
  nameFilter = new FormControl();
  stdNameFilter = new FormControl();
  typeFilter = new FormControl();
  langFilter = new FormControl();
  langFilterOptions: Array<TableFilterDDModel> = [];
  typeFilterOptions: Array<TableFilterDDModel> = [];
  nameType = 'name';
  hideFilters = true;
  showHideFilterText = 'Show Filter';

  constructor(
    private dialog: MatDialog,
    public gaService: GoogleAnalyticsService,
    private cvService: ControlledVocabularyService,
    private overlayContainerService: OverlayContainer,
    private utilsService: UtilsService
  ) {
    super(gaService);
  }

  ngOnInit() {

    this.filterSelectObj = [
      {
        name: 'Name Type',
        columnProp: 'type',
        options: []
      }
    ];

    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null && this.substance.names != null) {
        this.names = this.substance.names;
        this.filtered = this.substance.names;
        this.countUpdate.emit(this.names.length);
        this.searchControl.valueChanges.subscribe(value => {
          if (this.typeFilterOn === 'false') {
            this.filterList(value, this.names, this.analyticsEventCategory);

          } else if (this.typeFilterOn === 'true') {
            const tempFilter = JSON.parse(JSON.stringify(this.filtered));
            this.filterList(value, this.filterBackup, this.analyticsEventCategory);
          }
        }, error => {
          console.log(error);
        });
        this.getVocabularies();
        // move display name to top
        this.filtered = this.names.slice().sort((a, b) => {
          let returned = -1;
          if (a.displayName) {
            returned = -1;
          } else if (b.displayName) {
            returned = 1;
          } else if (b.preferred && !a.preferred) {
            returned = 1;
          } else if (!b.preferred && a.preferred) {
            returned = -1;
          }else if (a.name.toUpperCase() > b.name.toUpperCase()) {
            returned = 1;
          }
          return returned;
        });
      }

      this.pageChange();

      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(this.names, o.columnProp);
      });
      });
      this.overlayContainer = this.overlayContainerService.getContainerElement();
      this.nameFilter.valueChanges.subscribe((nameFilterValue) => {
        this.filterTable();
      });
      this.stdNameFilter.valueChanges.subscribe((stdNameFilterValue) => {
        this.filterTable('std');
      });
      this.typeFilter.valueChanges.subscribe((typeFilterValue) => {
        this.filterTable();
      });
      this.langFilter.valueChanges.subscribe((langFilterValue) => {
        this.filterTable();
      });
  }

  toggleFilter() {
    this.hideFilters = !this.hideFilters;
    if(this.hideFilters) {
      this.showHideFilterText = 'Show Filter';
    } else {
      this.showHideFilterText = 'Hide Filter';
    }
  }

  updateType(event) {
    this.nameType = event.value;
    if(event.value === 'name') {
      this.displayedColumns = ['name', 'type', 'language', 'details', 'references'];
      this.displayedFilterColumns = ['nameFilter', 'typeFilter', 'languageFilter', 'emptyFilter', 'resetFilter'];
    } else if (event.value === 'ascii') {
      this.displayedColumns = ['stdName', 'type', 'language', 'details', 'references'];
      this.displayedFilterColumns = ['stdNameFilter', 'typeFilter', 'languageFilter', 'emptyFilter', 'resetFilter'];
    } else {
      this.displayedColumns = ['name', 'stdName', 'type',  'language', 'details', 'references'];
      this.displayedFilterColumns = ['nameFilter', 'stdNameFilter', 'typeFilter', 'languageFilter', 'resetFilter'];
    }
}

  filterTable(type?:string) {
    const nFilter = this.nameFilter.value === null ? '' : this.nameFilter.value;
    const snFilter = this.stdNameFilter.value === null ? '' : this.stdNameFilter.value;

    const lFilter = this.langFilter.value === null ? '' : this.langFilter.value;
    const tFilter = this.typeFilter.value === null ? '' : this.typeFilter.value;
    const lFilterCode = this.getLangFilterValue(lFilter) === undefined ? '' : this.getLangFilterValue(lFilter).value;
    const tFilterCode = this.getTypeFilterValue(tFilter) === undefined ? '' : this.getTypeFilterValue(tFilter).value;
    this.filtered = [];
    if(type && type === 'std') {
      for(let n of this.names) {
        let stdNameStr = n.stdName === undefined ? '' : n.stdName;
        if((stdNameStr.toLowerCase().includes(snFilter.toLowerCase())) &&
        (this.isIncluded(n, tFilterCode, 'type')) &&
        (this.isIncluded(n, lFilterCode, 'lang'))) {
          this.filtered.push(n);
        }
      }
    } else {
      for(let n of this.names) {
        if((n.name.toLowerCase().includes(nFilter.toLowerCase())) &&
        (this.isIncluded(n, tFilterCode, 'type')) &&
        (this.isIncluded(n, lFilterCode, 'lang'))) {
          this.filtered.push(n);
        }
      }
    }
    
    this.pageChange();
  }

  isIncluded(name: SubstanceName, value: string, field: string) {
    if(field === 'type') {
      if(value.length > 0) {
        if(name.type.includes(value)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else if(field === 'lang') {
      if(value.length > 0) {
        if(name.languages.includes(value)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  }

  getLangFilterValue(value) {
    for(let l of this.langFilterOptions) {
      if(l.display === value) {
        return l;
      }
    }
  }

  getLangFilterOptions() {
    for(let n of this.names) {
      let nLangs = n.languages;
      for(let l of nLangs) {
        let oneLang = l;
        let oneLangDisplay = this.languageVocabulary[oneLang] && this.languageVocabulary[oneLang].display ? this.languageVocabulary[oneLang].display : oneLang;
        let value: TableFilterDDModel = {
          value: oneLang,
          display: oneLangDisplay
        }
        if (this.langFilterOptions.filter(e => e.value === oneLang).length > 0) {
        } else {
          this.langFilterOptions.push(value);
        }
      }
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
    for(let n of this.names) {
        let oneType = n.type;
        let oneTypeDisplay = this.typeVocabulary[oneType] && this.typeVocabulary[oneType].display ? this.typeVocabulary[oneType].display : oneType;
        let value: TableFilterDDModel = {
          value: oneType,
          display: oneTypeDisplay
        }
        if (this.typeFilterOptions.filter(e => e.value === oneType).length > 0) {
        } else {
          this.typeFilterOptions.push(value);
        }
    }
  }

  filterChange(filter, event) {
    this.typeFilterOn = 'false';
    const tempFiltered = [];
    this.filterBackup = [];
      this.names.forEach(item => {
        const itemString = JSON.stringify(item[filter.columnProp]).toLowerCase();
        if (itemString.indexOf(event.target.value.toLowerCase()) > -1) {
          this.filterBackup.push(item);
        }
    });
    setTimeout(() => {
 
      this.names.forEach(item => {
        const itemString = JSON.stringify(item[filter.columnProp]).toLowerCase();
        if (itemString.indexOf(event.target.value.toLowerCase()) > -1) {
            tempFiltered.push(item);
        }
    });
    this.filtered = tempFiltered;
    this.typeFilterOn = 'true';
    this.page = 0;
    this.pageChange();
    }, 50);
  }

  setDisplay(value, column) {
    if (column === 'type') {
        return (this.typeVocabulary[value] && this.typeVocabulary[value].display ? this.typeVocabulary[value].display : value);
    } else if (column === 'language') {
      return ( this.languageVocabulary[value] && this.languageVocabulary[value].display ? this.typeVocabulary[value].display : value);
    } else {
      return value;
    }
  }

  getFilterObject(fullObj, key) {
    const uniqChk = [];
    if (key === 'type') {

    }
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {
        uniqChk.push(obj[key]);
      }
      return obj;
    });
    return uniqChk;
  }

  sortData(sort: Sort) {
    const data = this.names.slice();
    if (!sort.active || sort.direction === '') {
      this.filtered = data;
      this.pageChange();
      return;
    }
    this.filtered = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.utilsService.compare(a.name ? a.name.toUpperCase() : '', b.name ? b.name.toUpperCase() : '', isAsc);
        case 'type': return this.utilsService.compare(a.type ? a.type : '', b.type ? b.type : '', isAsc);
        case 'language': return this.utilsService.compare(this.getLanguages(a), this.getLanguages(b), isAsc);
        default: return 0;
      }
    });
    this.pageChange();
  }

  resetFilters() {
    this.filterSelectObj.forEach((value, key) => {
      value.modelValue = undefined;
    });
    this.typeFilterOn = 'false';
    this.filtered = this.names;
    this.pageChange();
    this.searchControl.setValue('');
    this.nameFilter.setValue('');
    this.stdNameFilter.setValue('');
    this.langFilter.setValue('');
    this.typeFilter.setValue('');
  }


  getVocabularies(): void {
    this.cvService.getDomainVocabulary('LANGUAGE', 'NAME_TYPE').subscribe(response => {
      this.languageVocabulary = response['LANGUAGE'] && response['LANGUAGE'].dictionary;
      this.typeVocabulary = response['NAME_TYPE'] && response['NAME_TYPE'].dictionary;
      this.getLangFilterOptions();
      this.getTypeFilterOptions();
    });
  }

  getLanguages(name: SubstanceName): string {
    if (this.languageVocabulary != null && name.languages && name.languages.length) {
      const languagesArray = [];
      name.languages.forEach(language => {
        if (this.languageVocabulary[language] != null) {
          languagesArray.push(this.languageVocabulary[language].display);
        }
      });
      return languagesArray.join(', ');
    } else {
      return '';
    }
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

  isButtonDisabled(name) {
    if((!name.nameOrgs || name.nameOrgs.length == 0) && (!name.domains || name.domains.length == 0) &&
    (!name.nameJurisdiction || name.nameJurisdiction.length == 0 )) {
      return true;
    } else {
      return false
    }
  }

  close() {
    this.dialog.closeAll();
  }

}

