import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceNote } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-substance-form-notes',
  templateUrl: './substance-form-notes.component.html',
  styleUrls: ['./substance-form-notes.component.scss']
})
export class SubstanceFormNotesComponent extends SubstanceFormSectionBase implements OnInit, AfterViewInit {
  notes: Array<SubstanceNote>;

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Notes');
  }

  ngAfterViewInit() {
    this.substanceFormService.substanceNotes.subscribe(notes => {
      this.notes = notes;
    });
  }

  addNote(): void {
    this.substanceFormService.addSubstanceNote();
  }

  deleteNote(note: SubstanceNote): void {
    this.substanceFormService.deleteSubstanceNote(note);
  }

}
