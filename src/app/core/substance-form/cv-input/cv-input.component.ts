import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {UtilsService} from '@gsrs-core/utils';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';
import {CvDialogComponent} from '@gsrs-core/substance-form/cv-dialog/cv-dialog.component';
import {DataDictionaryService} from '@gsrs-core/utils/data-dictionary.service';
import {AuthService} from '@gsrs-core/auth';
import { FragmentWizardComponent } from '@gsrs-core/admin/fragment-wizard/fragment-wizard.component';
import { ConfigService } from '@gsrs-core/config';

/*
  used for any input that uses cv vocabulary to handle custom values after selecting 'other'
 */

@Component({
  selector: 'app-cv-input',
  templateUrl: './cv-input.component.html',
  styleUrls: ['./cv-input.component.scss']
})
export class CvInputComponent implements OnInit, OnDestroy {
  @Input() vocabulary?: any;
  @Input() title?: string;
  @Input() domain?: string;
  @Input() key?: string;
  @Input() required?: boolean;
  @Input() disable?: boolean;
  @Output()
  valueChange = new EventEmitter<string>();
  vocabName = '';
  privateMod: any;
  dictionary: any;
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];
  isAdmin: boolean;

  constructor(
    public cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private overlayContainerService: OverlayContainer,
    private dictionaryService: DataDictionaryService,
    private authService: AuthService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    if (this.vocabulary) {
      this.vocabulary = this.addOtherOption(this.vocabulary, this.privateMod);
      this.sortFromConfig();

    } else if (this.key) {
      this.dictionary = this.
      dictionaryService.getDictionaryRow(this.key);
      if (!this.title) {
        this.title = this.dictionary.fieldName;
      }
      this.vocabName = this.dictionary.CVDomain;
     const cvSubscription =  this.cvService.getDomainVocabulary(this.vocabName).subscribe(response => {
        this.vocabulary = response[this.vocabName].list;
        this.sortFromConfig();

      });
      this.subscriptions.push(cvSubscription);
    } else {
      this.vocabulary = [];
    this.vocabName = this.domain;
      const cvSubscription =  this.cvService.getDomainVocabulary(this.vocabName).subscribe(response => {
        this.vocabulary = response[this.vocabName].list;
        this.sortFromConfig();
      });
      this.subscriptions.push(cvSubscription);

    }
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.isAdmin = this.authService.hasRoles('admin');
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  //sort dropdown based on config settings
  //for example "CVDisplayOrder": {  "DOCUMENT_TYPE": ["IND", "NDA"],
  sortFromConfig(vocab?: any) {
    if (!vocab) {
      vocab = this.vocabulary;
    }
    let vocabName = this.vocabName;
    if(this.key && this.key !== '') {
      // wrong format, ignore for now
    }
    if (this.configService && this.configService.configData && this.configService.configData.CVDisplayOrder && this.configService.configData.CVDisplayOrder[vocabName] ) {
      let configOrder = this.configService.configData.CVDisplayOrder[vocabName] ;
      for(let i = configOrder.length-1; i >=0; i--) {
        let check = configOrder[i];
        vocab.forEach(function(item,j){
          if(item.value == check){
            vocab.splice(j, 1);
            vocab.unshift(item);
          }
        });
    }
      this.vocabulary = vocab;
    }
  }

  @Input()
  set model(mod: any) {
    this.privateMod = mod;

  }

  get model(): any {
    return this.privateMod;
  }

  select(event: any): void {
    this.privateMod = event;
  this.valueChange.emit(this.privateMod);
  }

  addOtherOption(vocab: Array<VocabularyTerm>, property: string): any {
    if ((vocab) && (vocab.some(r => property === r.value))) {
    } else {
    }
    return vocab;
  }

  inCV(vocab: Array<VocabularyTerm>, property: string): boolean {
    if (vocab) {
      return vocab.some(r => property === r.value);
    } else {
      return true;
    }

  }

  addToVocab() {
    const vocabSubscription = this.cvService.fetchFullVocabulary(this.vocabName).subscribe ( response => {
      if (response.content && response.content.length > 0) {
        const toPut = response.content[0];
        this.openDialog(toPut, this.privateMod);
      }
    });
    this.subscriptions.push(vocabSubscription);
  }

  updateOrigin(event): void {
    if (event && event.value !== '') {
      this.privateMod = event.value;
      this.valueChange.emit(this.privateMod);
    }
  }

  openDialog(vocab: any, term: string): void {
    let thisy = window.pageYOffset;
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto'
});

   // this.overlayContainer = this.overlayContainerService.getContainerElement();
    if (vocab.domain === 'NUCLEIC_ACID_LINKAGE' || vocab.domain === 'NUCLEIC_ACID_SUGAR'){
      this.overlayContainer.style.zIndex = '1005';

      let dialogRef = this.dialog.open(FragmentWizardComponent, {
        data: {'vocabulary': vocab, 'term': term},
        width: '1040px',
        height: '85%'
      });
      this.overlayContainer.style.zIndex = '1005';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      window.scroll({
        top: thisy,
        left: 0,
        behavior: 'auto'
  });
      this.overlayContainer.style.zIndex = null;
      if (response ) {
        this.privateMod = response.display;
        this.vocabulary.push(response);
        this.valueChange.emit(this.privateMod);
      }
    });
    this.subscriptions.push(dialogSubscription);
    } else {
      let dialogRef = this.dialog.open(CvDialogComponent, {
        data: {'vocabulary': vocab, 'term': term},
        width: '1040px'
      });
  //    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
   //   this.overlayContainer.style.zIndex = null;
   window.scroll({
    top: thisy,
    left: 0,
    behavior: 'auto'
});
      if (response ) {
        this.privateMod = response.display;
        this.vocabulary.push(response);
        this.valueChange.emit(this.privateMod);
      }
    });
    this.subscriptions.push(dialogSubscription);
    }
  }
}
