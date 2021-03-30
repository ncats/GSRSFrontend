import {Component, OnInit, AfterViewInit} from '@angular/core';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import {SubstanceDetail, SubstanceName} from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import {MatDialog} from '@angular/material';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {Subject} from 'rxjs';
import {Sort} from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import {UtilsService} from '@gsrs-core/utils';

@Component({
  selector: 'app-substance-names',
  templateUrl: './substance-names.component.html',
  styleUrls: ['./substance-names.component.scss']
})
export class SubstanceNamesComponent extends SubstanceCardBaseFilteredList<SubstanceName> implements OnInit {
  names: Array<SubstanceName>;
  displayedColumns: string[] = ['name', 'type', 'language', 'details', 'references'];
  languageVocabulary: { [vocabularyTermValue: string]: VocabularyTerm } = {};
  typeVocabulary: { [vocabularyTermValue: string]: VocabularyTerm } = {};
  substanceUpdated = new Subject<SubstanceDetail>();
  private overlayContainer: HTMLElement;
  hideOrgs = true;
  pageSize = 10;
  uniqueVals: Array<string>;
  filterSelectObj = [];
  filterBackup: Array<T>;
  typeFilterOn = 'false';

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
          if ( b.displayName === true) {
            returned = 1;
          } else if (b.preferred === true && a.displayName !== true) {
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

  }

  filterChange(filter, event) {
    this.typeFilterOn = 'disable search';
    const tempFiltered = [];
    // const tempFiltered = this.filtered;
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
        case 'name': return this.utilsService.compare(a.name.toUpperCase(), b.name.toUpperCase(), isAsc);
        case 'type': return this.utilsService.compare(a.type, b.type, isAsc);
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
    this.typeFilterOn = false;
    this.filtered = this.names;
    this.pageChange();
    this.searchControl.setValue('');
  }


  getVocabularies(): void {
    this.cvService.getDomainVocabulary('LANGUAGE', 'NAME_TYPE').subscribe(response => {
      this.languageVocabulary = response['LANGUAGE'] && response['LANGUAGE'].dictionary;
      this.typeVocabulary = response['NAME_TYPE'] && response['NAME_TYPE'].dictionary;
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

}

