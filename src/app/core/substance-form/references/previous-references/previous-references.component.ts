import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { AuthService } from '@gsrs-core/auth';
import { SubstanceReference } from '@gsrs-core/substance/substance.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-previous-references',
  templateUrl: './previous-references.component.html',
  styleUrls: ['./previous-references.component.scss']
})
export class PreviousReferencesComponent implements OnInit {
  user: string;
  refCount: number;
  loading = true;
  pageIndex = 0;
  pageSize = 10;
oldReferences: Array<SubstanceReference> = [];
pagedReferences: Array<SubstanceReference> = [];

displayedColumns: string[] = ['use', 'citation', 'type', 'tags', 'dateAcessed'];
@Output() selectedReference = new EventEmitter<SubstanceReference>();
  constructor(
    private substanceService: SubstanceService,
    private authService: AuthService) { }

  ngOnInit() {
    this.user =  this.authService.getUser();
    this.substanceService.getSubstanceReferences(1, this.user).subscribe( response => {
      if (response.total) {
        this.refCount = response.total;
      } else {
        this.refCount = 0;
      }
      this.getPreviousReferences();
    });
  }

  getPreviousReferences(): void {
    let skip = this.refCount - 100;

    if (this.refCount < 100) {
      skip = 0;
    }
    let total = this.refCount < 90 ? this.refCount : 90;
    this.substanceService.getSubstanceReferences(total, this.user).subscribe( response => {
      if (response.count && response.content) {
        for (let i = (response.content.length - 1); i >= 0; i--) {

          if (this.user === response.content[i]['lastEditedBy']
              && response.content[i]['docType']
              && response.content[i]['citation']
              && response.content[i]['docType'] !==  'SYSTEM'
              && response.content[i]['docType'] !==  'BATCH_IMPORT'
              && response.content[i]['docType'] !==  'VALIDATION_MESSAGE' ) {
            this.oldReferences.push(response.content[i]);
          }
        }
          this.oldReferences =  this.oldReferences.filter((obj, index, self) =>
              index === self.findIndex((current) => (
                current['citation'] === obj['citation'] && current['docType'] === obj['docType']
              ))
          );
          this.oldReferences.sort((a, b) => b.lastEdited - a.lastEdited);
          this.pagedReferences = JSON.parse(JSON.stringify( this.oldReferences)).slice(0, (this.pageSize));
        this.loading = false;
      } else {
        this.loading = false;
      }
    });
  }


  changePage(pageEvent: PageEvent) {
    this.pageIndex = pageEvent.pageIndex;
    this.pagedReferences = [];
    const skip = 10 * pageEvent.pageIndex;
    this.pagedReferences = JSON.parse(JSON.stringify( this.oldReferences)).slice(skip, (this.pageSize + skip));
  }

  selectReference(ref: SubstanceReference) {
    this.selectedReference.emit(ref);
  }
  
    
  

}
