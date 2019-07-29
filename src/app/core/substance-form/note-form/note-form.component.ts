import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SubstanceNote } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.scss']
})
export class NoteFormComponent implements OnInit {
  private privateNote: SubstanceNote;
  @Output() noteDeleted = new EventEmitter<SubstanceNote>();
  isDeleted = false;
  noteControl = new FormControl('');

  constructor(
  ) { }

  ngOnInit() {
  }

  @Input()
  set note(note: SubstanceNote) {
    this.privateNote = note;
    this.noteControl.setValue(this.note.note);
    this.noteControl.valueChanges.subscribe(value => {
      this.note.note = value;
    });
  }

  get note(): SubstanceNote {
    return this.privateNote;
  }

  deleteNote(): void {
    this.isDeleted = true;
    setTimeout(() => {
      this.noteDeleted.emit(this.note);
    }, 500);
  }

  updateAccess(access: Array<string>): void {
    this.note.access = access;
  }

}
