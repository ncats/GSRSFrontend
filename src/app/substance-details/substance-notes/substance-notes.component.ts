import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import { SubstanceNote } from '../../substance/substance.model';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-substance-notes',
  templateUrl: './substance-notes.component.html',
  styleUrls: ['./substance-notes.component.scss']
})
export class SubstanceNotesComponent extends SubstanceCardBase implements OnInit {
  notes: Array<SubstanceNote> = [];
  displayedColumns: string[] = ['note', 'references'];


  constructor(
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    if (this.substance != null && this.substance.notes != null && this.substance.notes.length) {
      this.notes = this.substance.notes;
    }
  }


  openModal(templateRef) {
    const dialogRef = this.dialog.open(templateRef, {
      minWidth: '40%',
      maxWidth: '90%'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
