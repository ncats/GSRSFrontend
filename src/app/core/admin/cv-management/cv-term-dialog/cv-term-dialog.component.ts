import { Component, OnInit, Input, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { VocabularyTerm, Vocabulary, ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { FragmentWizardComponent } from '@gsrs-core/admin/fragment-wizard/fragment-wizard.component';

@Component({
  selector: 'app-cv-term-dialog',
  templateUrl: './cv-term-dialog.component.html',
  styleUrls: ['./cv-term-dialog.component.scss']
})
export class CvTermDialogComponent implements OnInit, AfterViewInit{
  isNew: boolean;
  vocabulary: Vocabulary;
  terms: any;
  message: string;
  loading = true;
  toggled = [];
  private overlayContainer: HTMLElement;


  constructor(
    public cvService: ControlledVocabularyService,
    public dialogRef: MatDialogRef<CvTermDialogComponent>,
    public scrollToService: ScrollToService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.vocabulary = data.vocabulary;
    this.terms = data.vocabulary.terms.sort(function(a, b) {
      const textA = a.value ? a.value.toUpperCase() : '';
      const textB = b.value ? b.value.toUpperCase() : '';
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    }
    @ViewChild('scroller', {static: false}) private myScrollContainer: ElementRef;



  ngOnInit() {
    this.loading = false;
  //  this.overlayContainer = this.overlayContainerService.getContainerElement();

}

  ngAfterViewInit() {
  
    if (this.vocabulary.vocabularyTermType === 'ix.ginas.models.v1.FragmentControlledVocabulary') {
      this.terms.forEach(term => {
        if (term.simplifiedStructure) {
            term.simpleSrc = this.cvService.getStructureUrl(term.simplifiedStructure);
        }
        if (term.fragmentStructure) {
          term.fragmentSrc = this.cvService.getStructureUrl(term.fragmentStructure);
      }
      });
    }
  }

  updateStructure(term: any, index: any) {
    this.terms[index] = term;
  }

  getStructure(structure) {
    this.cvService.getStructure(structure).subscribe(response => (
      response
    ));
  }

  editTerms(term: any, index): void {
    this.dialog.openDialogs.pop();

    let thisy = window.pageYOffset;
  /*  window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'auto' });*/
      let dialogConfig = {  width: '60%', height: '80%',data: {vocabulary: this.vocabulary, domain: this.vocabulary.domain, term: term, adminPanel: true}, };
    const dialogRef = this.dialog.open(FragmentWizardComponent, dialogConfig);
  
    setTimeout(() => {
      this.dialog.openDialogs.pop();
      this.dialog.openDialogs.pop();
    },2000);
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      window.scroll({ 
        top: thisy, 
        left: 0, 
        behavior: 'auto' });
    //  this.overlayContainer.style.zIndex = null;
      if (response ) {
          this.terms[index].simplifiedStructure = response;
          this.terms[index].fragmentStructure = response;
          this.terms[index].fragmentSrc = this.cvService.getStructureUrl(response);
          this.terms[index].simpleSrc = this.cvService.getStructureUrl(response);

     //   this.getVocab();
      }
    });
  }


  checkImg(term: any, img: string) {
    term.fragmentSrc = this.cvService.getStructureUrl(term.fragmentStructure);
    term.simpleSrc = this.cvService.getStructureUrl(term.simplifiedStructure);

  }



  submit(): void {
    this.vocabulary.terms = this.terms;
    this.cvService.addVocabTerm( this.vocabulary).subscribe (response => {
      this.loading = false;
      if (response.terms && response.terms.length === this.vocabulary.terms.length) {
        alert('vocabulary updated');
        setTimeout(() => {
          this.dialogRef.close(response);
        }, 200);
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
