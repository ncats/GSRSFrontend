import { Component, OnInit, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { VocabularyTerm, Vocabulary, ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';

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
    public scrollToService: ScrollToService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.vocabulary = data.vocabulary;
    this.terms = data.vocabulary.terms.sort(function(a, b) {
      const textA = a.value.toUpperCase();
      const textB = b.value.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    }
    @ViewChild('scroller', {static: false}) private myScrollContainer: ElementRef;



  ngOnInit() {
    this.loading = false;

  }

  submit(): void {
    this.vocabulary.terms = this.terms;
    this.cvService.addVocabTerm( this.vocabulary).subscribe (response => {
      this.loading = false;
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
    setTimeout(() => {
      try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
    }, 100);
  }

  deleteTerm(index: number): void {
    this.terms.splice(index, 1);
  }
}
