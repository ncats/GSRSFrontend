import {Component, OnInit, ViewChild} from '@angular/core';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import { SubstanceName } from '../../substance/substance.model';
import { UtilsService } from '../../utils/utils.service';
import { VocabularyTerm } from '../../utils/vocabulary.model';
import {MatDialog, MatSort} from '@angular/material';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {Sort} from '@angular/material';

@Component({
  selector: 'app-substance-names',
  templateUrl: './substance-names.component.html',
  styleUrls: ['./substance-names.component.scss']
})
export class SubstanceNamesComponent extends SubstanceCardBaseFilteredList<SubstanceName> implements OnInit {
  names: Array<SubstanceName>;
  displayedColumns: string[] = ['name', 'type', 'language', 'references'];
  languageVocabulary: { [vocabularyTermValue: string]: VocabularyTerm } = {};
  typeVocabulary: { [vocabularyTermValue: string]: VocabularyTerm } = {};
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private utilsService: UtilsService,
    private dialog: MatDialog,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
  }

  ngOnInit() {
    if (this.substance != null && this.substance.names != null) {
      this.names = this.substance.names;
      this.filtered = this.substance.names;
      this.countUpdate.emit(this.names.length);
      this.pageChange();

      this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.names, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });

      this.getLanguageVocabulary();
      this.getTypeVocabulary();
    }
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
        case 'name': return compare(a.name, b.name, isAsc);
        case 'type': return compare(a.type, b.type, isAsc);
        case 'language': return compare(this.getLanguages(a), this.getLanguages(b), isAsc);
        default: return 0;
      }
    });
    this.pageChange();
  }

  getLanguageVocabulary(): void {
    this.utilsService.getDomainVocabulary('LANGUAGE').subscribe(response => {
      this.languageVocabulary = response;
    });
  }

  getTypeVocabulary(): void {
    this.utilsService.getDomainVocabulary('NAME_TYPE').subscribe(response => {
      this.typeVocabulary = response;
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

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
