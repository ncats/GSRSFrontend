import { Component, OnInit, Input } from '@angular/core';
import {SubstanceDetail, SubstanceReference} from '../substance/substance.model';
import {SubstanceService} from '../substance/substance.service';
import {DatePipe} from '@angular/common';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-references-manager',
  templateUrl: './references-manager.component.html',
  styleUrls: ['./references-manager.component.scss']
})
export class ReferencesManagerComponent implements OnInit {
  @Input() substance?: SubstanceDetail;
  @Input() subUUID?: string;
  @Input() references: Array<String>;
  subRef: Array<SubstanceReference>;
  matchedRef: SubstanceReference[] = [];
  displayedColumns: string[] = ['index', 'citation', 'docType', 'tags', 'lastEdited'];


  constructor(private substanceService: SubstanceService) { }

  ngOnInit() {
    if (this.substance) {
      this.subRef = this.substance.references;
    } else if (this.subUUID) {
      const subscription = this.substanceService.getSubstanceDetails(this.subUUID).pipe(take(1)).subscribe(response => {
        if (response) {
          this.substance = response;
          this.subRef = this.substance.references;
        }
        subscription.unsubscribe();
      }, error => {
        subscription.unsubscribe();
      });
    }
    if (this.subRef) {
      this.compileReferences();
    }
  }

  compileReferences() {
    if (this.substance.references) {
      this.substance.references.forEach(ref => {
        const uuid = ref.uuid;
        if (this.references.indexOf(uuid) > -1) {
          this.matchedRef.push(ref);
        }
      });
    }
  }

  convertTimestamp(time: number) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(time, 'MMM dd, yyyy');
 }

  getParentIndex(uuid: SubstanceReference) {
    return (this.subRef.indexOf(uuid) + 1) ;
  }
}




