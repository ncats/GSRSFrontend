import { Component, OnInit} from '@angular/core';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import {SubstanceDetail, SubstanceName} from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import {MatDialog} from '@angular/material';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {Subject, Subscription} from 'rxjs';

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
  substanceUpdated = new Subject<SubstanceDetail>();

  constructor(
    private dialog: MatDialog,
    public gaService: GoogleAnalyticsService,
    private cvService: ControlledVocabularyService
  ) {
    super(gaService);
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null && this.substance.names != null) {
        this.names = this.substance.names;
        this.filtered = this.substance.names;
        this.countUpdate.emit(this.names.length);
        this.pageChange();
      }
      });
    if (this.substance != null && this.substance.names != null) {
      this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.names, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });

      this.getVocabularies();
    }

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

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
