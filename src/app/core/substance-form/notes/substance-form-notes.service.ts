import { Injectable } from '@angular/core';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormService } from '../substance-form.service';
import { ReplaySubject, Observable } from 'rxjs';
import { SubstanceNote } from '@gsrs-core/substance/substance.model';
import { SubstanceFormNotesModule } from './substance-form-notes.module';

@Injectable({
  providedIn: SubstanceFormNotesModule
})
export class SubstanceFormNotesService extends SubstanceFormServiceBase<Array<SubstanceNote>> {

  constructor(
    public substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.notes == null) {
        this.substance.notes = [];
      }
      this.substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.notes);
    });
    this.subscriptions.push(subscription);
  }

  get substanceNotes(): Observable<Array<SubstanceNote>> {
    return this.propertyEmitter.asObservable();
  }

  addSubstanceNote(): void {
    const newNote: SubstanceNote = {
      references: [],
      access: []
    };
    this.substance.notes.unshift(newNote);
    this.propertyEmitter.next(this.substance.notes);
  }

  deleteSubstanceNote(note: SubstanceNote): void {
    const subNoteIndex = this.substance.notes.findIndex(subNote => note.$$deletedCode === subNote.$$deletedCode);
    if (subNoteIndex > -1) {
      this.substance.notes.splice(subNoteIndex, 1);
      this.propertyEmitter.next(this.substance.notes);
    }
  }
}
