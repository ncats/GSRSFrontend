import { Component, OnInit } from '@angular/core';
import { ControlledVocabularyService, Vocabulary, VocabularyTerm } from '@gsrs-core/controlled-vocabulary';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CvTermDialogComponent } from '@gsrs-core/admin/cv-management/cv-term-dialog/cv-term-dialog.component';
import { UtilsService } from '@gsrs-core/utils';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { DataDictionaryService } from '@gsrs-core/utils/data-dictionary.service';

@Component({
  selector: 'app-cv-management',
  templateUrl: './cv-management.component.html',
  styleUrls: ['./cv-management.component.scss']
})
export class CvManagementComponent implements OnInit {
  vocabularies: Array< Vocabulary > = [];
  displayedColumns: string[] = ['domain', 'type', 'path', 'terms',  'edit'];
  filtered: Array< Vocabulary >;
  vocabType: any = [];
  downloadHref: SafeUrl;
  searchControl = new FormControl();
  dictionary: Array< any >;
  loading: boolean;
  toggle: Array< boolean > = [];
  private searchTimer: any;
  private overlayContainer: HTMLElement;

  constructor(public cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
    private utilsService: UtilsService,
    private sanitizer: DomSanitizer,
    private dictionaryService: DataDictionaryService



  ) { }

  ngOnInit() {
      this.getVocab();
      this.overlayContainer = this.overlayContainerService.getContainerElement();

  }

  getVocab() {
    this.loading = true;
      this.cvService.getVocabularies(null, 1000).subscribe(response => {
        this.loading = false;
        this.dictionary =  this.dictionaryService.getCVDomainRows();
        this.vocabularies = response.content;
        this.filtered = this.vocabularies;
        this.vocabularies.forEach(vocab => {
          if (vocab.domain === 'VOCAB_TYPE') {
            this.vocabType = vocab.terms;
          }
          this.searchControl.valueChanges.subscribe(value => {
            this.filterList(value, this.vocabularies);
          }, error => {
            this.loading = false;
            alert('The controlled vocabulary has failed to load from the server' +
             (error && error.message ? 'with the following message \n\n' + error.message : ''));
          });
        });
        this.downloadHref = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' +
         encodeURIComponent(JSON.stringify(this.vocabularies)));
         this.sortData({active: 'domain', direction: 'asc'});
      });
  }

  getVocabType(type: string): string {
    this.vocabType.forEach( term => {
      if (term.value === type) {
        type = term.display;
      }
    });
    return type;
  }

  getPath(val: string): string {
    if (this.dictionary[val]) {
      return this.dictionary[val];
    } else {
      return '';
    }
  }

  editTerms(vocab: any, index: number): void {
    const dialogRef = this.dialog.open(CvTermDialogComponent, {
      data: {vocabulary: vocab},
      width: '1200px'
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
      if (response ) {
        //  this.vocabularies[index] = response;
        this.getVocab();
      }
    });
  }


  sortData(sort: Sort) {
    const data = this.vocabularies.slice();
    if (!sort.active || sort.direction === '') {
      this.filtered = data;
      return;
    }
    this.filtered = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.utilsService.compare(a[sort.active], b[sort.active], isAsc);
    });
  }

  download() {

    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(
      JSON.stringify(this.vocabularies)
    ));
    this.downloadHref = uri;
  }

  filterList(searchInput: string, listToFilter: Array<any>): void {
    if (this.searchTimer != null) {
        clearTimeout(this.searchTimer);
    }

    this.searchTimer = setTimeout(() => {

        this.filtered = [];
        listToFilter.forEach(item => {
          const itemString = item.domain;
            if (itemString.indexOf(searchInput.toUpperCase()) > -1) {
                this.filtered.push(item);
            }
        });
        clearTimeout(this.searchTimer);
        this.searchTimer = null;
    }, 700);
}

}
