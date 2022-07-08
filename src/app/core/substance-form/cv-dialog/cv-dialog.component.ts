import {Component, Inject, OnInit} from '@angular/core';
import {SubstanceAmount} from '@gsrs-core/substance';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ControlledVocabularyService, Vocabulary, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {UtilsService} from '@gsrs-core/utils';

@Component({
  selector: 'app-cv-dialog',
  templateUrl: './cv-dialog.component.html',
  styleUrls: ['./cv-dialog.component.scss']
})
export class CvDialogComponent implements OnInit {
  isNew: boolean;
  term: VocabularyTerm = {value: '', display: ''};
  vocabulary: Vocabulary;
  message: string;
  validationMessages = [];

  constructor(
    public cvService: ControlledVocabularyService,
    private utilsService: UtilsService,
    public dialogRef: MatDialogRef<CvDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.vocabulary = data.vocabulary;
    this.term.value = data.term;
    this.term.display = data.term;
  }

  ngOnInit() {
    // this.vocabulary = this.data.vocabulary;
    // this.term.value = this.data.term;
    // this.term.display = this.data.term;
  }

  submit(): void {
    let extant = false;
    this.message = '';
    this.validationMessages = [];
    this.vocabulary.terms.forEach(term => {
      if (term.value === this.term.value) {
        extant = true;
      }
    });
    if (!extant) {
      this.vocabulary.terms.push(this.term);
      this.cvService.validateVocab(this.vocabulary).subscribe(response => {
        if(response && response.valid) {
          this.validationMessages = [];
          this.cvService.addVocabTerm( this.vocabulary).subscribe (response => {
            if (response.terms && response.terms.length === this.vocabulary.terms.length) {
              this.message = 'Term ' + this.term.value + ' Added to ' + this.vocabulary.domain + '';
              setTimeout(() => {this.dialogRef.close(this.term); }, 3000);
            }
          });

        } else {
          if(response.validationMessages) {
            response.validationMessages.forEach(message => {
              this.validationMessages.push(message.messageType + ': ' +message.message);
            });
          }
        }
      },error => {
        console.log(error);
      });
      
    } else {
      
      this.message = 'Term already exists';
      setTimeout(() => {
        this.message = '';
      }, 1000);
    }
  }

  updateStructure(value) {
    this.term = value;
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
