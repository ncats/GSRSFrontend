import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VocabularyTerm} from '@gsrs-core/controlled-vocabulary';

/*
  used for any input that uses cv vocabulary to handle custom values after selecting 'other'
 */

@Component({
  selector: 'app-cv-input',
  templateUrl: './cv-input.component.html',
  styleUrls: ['./cv-input.component.scss']
})
export class CvInputComponent implements OnInit {
  @Input() vocabulary: any;
  @Input() title: string;
  @Output()
  valueChange = new EventEmitter<string>();
  privateMod: any;

  constructor() { }

  ngOnInit() {
    this.vocabulary = this.addOtherOption(this.vocabulary, this.privateMod);
  }

  @Input()
  set model(mod: any) {
    this.privateMod = mod;
    this.valueChange.emit(this.privateMod);

  }

  get model(): any {
    return this.privateMod;
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

  updateOrigin(event): void {
    if (event && event.value !== '') {
      this.privateMod = event.value;
      this.valueChange.emit(this.privateMod);
    }
  }
}
