import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {UtilsService} from '@gsrs-core/utils';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';
import {CvDialogComponent} from '@gsrs-core/substance-form/cv-dialog/cv-dialog.component';

/*
  used for any input that uses cv vocabulary to handle custom values after selecting 'other'
 */

@Component({
  selector: 'app-cv-input',
  templateUrl: './cv-input.component.html',
  styleUrls: ['./cv-input.component.scss']
})
export class CvInputComponent implements OnInit {
  @Input() vocabulary?: any;
  @Input() title: string;
  @Input() domain?: string;
  @Output()
  valueChange = new EventEmitter<string>();
  vocabName = '';
  privateMod: any;
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];

  constructor(
    public cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private overlayContainerService: OverlayContainer
  ) { }

  ngOnInit() {
    if (this.vocabulary) {
      this.vocabulary = this.addOtherOption(this.vocabulary, this.privateMod);
    } else {
      this.vocabulary = [];
    this.vocabName = this.domain;
      this.cvService.getDomainVocabulary(this.vocabName).subscribe(response => {
        this.vocabulary = response[this.vocabName].list;
      });
      }
    this.overlayContainer = this.overlayContainerService.getContainerElement();
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
    this.cvService.fetchFullVocabulary(this.vocabName).subscribe ( response => {
      if (response.content && response.content.length > 0) {
        const toPut = response.content[0];
        this.openDialog(toPut, this.privateMod);
      }
    });
  }

  updateOrigin(event): void {
    if (event && event.value !== '') {
      this.privateMod = event.value;
      this.valueChange.emit(this.privateMod);
    }
  }

  openDialog(vocab: any, term: string): void {
    const dialogRef = this.dialog.open(CvDialogComponent, {
      data: {'vocabulary': vocab, 'term': term},
      width: '1040px'
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
      if (response ) {
        const newTerm = response;
        this.privateMod = response.display;
        this.vocabulary.push(response);
        this.valueChange.emit(this.privateMod);
      }
    });
    this.subscriptions.push(dialogSubscription);
  }
}
