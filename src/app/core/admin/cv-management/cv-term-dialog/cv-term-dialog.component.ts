import { Component, OnInit, Input, Inject } from '@angular/core';
import { VocabularyTerm, Vocabulary, ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-cv-term-dialog',
  templateUrl: './cv-term-dialog.component.html',
  styleUrls: ['./cv-term-dialog.component.scss']
})
export class CvTermDialogComponent implements OnInit {
  isNew: boolean;
  vocabulary: Vocabulary;
  terms: any;
  message: string;
  loading = true;


  constructor(
    public cvService: ControlledVocabularyService,
    public dialogRef: MatDialogRef<CvTermDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.vocabulary = data.vocabulary;
    console.log(this.vocabulary);
    console.log(data.vocabulary);
    this.terms = data.vocabulary.terms;
    }


  ngOnInit() {
    this.loading = false;

  }

  submit(): void {
    console.log(this.vocabulary);
    this.vocabulary.terms = this.terms;
    this.cvService.addVocabTerm( this.vocabulary).subscribe (response => {
      this.loading = false;
      console.log(response);
      if (response.terms && response.terms.length === this.vocabulary.terms.length) {
        alert('vocabulary updated');
        setTimeout(() => {this.dialogRef.close(response); }, 200);
        } else {
          alert('invalid vocabulary');
        }
    }, error => {
      alert('invalid vocabulary');
    });
  }


  cancel(): void {
    this.dialogRef.close();
  }

  addTerm(): void {
    this.terms.push({});
  }

  deleteTerm(index: number): void {
    this.terms.splice(index, 1);
  }
}
