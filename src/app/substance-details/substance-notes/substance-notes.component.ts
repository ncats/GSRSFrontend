import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import { SubstanceNote } from '../../substance/substance.model';

@Component({
  selector: 'app-substance-notes',
  templateUrl: './substance-notes.component.html',
  styleUrls: ['./substance-notes.component.scss']
})
export class SubstanceNotesComponent extends SubstanceCardBase implements OnInit {
  notes: Array<SubstanceNote> = [];
  displayedColumns: string[] = ['note'];

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.substance != null && this.substance.notes != null && this.substance.notes.length) {
      this.notes = this.substance.notes;
    }
  }

}
