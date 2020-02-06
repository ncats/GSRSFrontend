import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SubstanceNote } from '../../substance/substance.model';
import { FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.scss']
})
export class NoteFormComponent implements OnInit {
  private privateNote: SubstanceNote;
  @Output() noteDeleted = new EventEmitter<SubstanceNote>();
  deleteTimer: any;

  constructor(
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
  }

  @Input()
  set note(note: SubstanceNote) {
    this.privateNote = note;
  }

  get note(): SubstanceNote {
    return this.privateNote;
  }

  deleteNote(): void {
    this.privateNote.$$deletedCode = this.utilsService.newUUID();
    if (!this.privateNote.note
    ) {
      this.deleteTimer = setTimeout(() => {
        this.noteDeleted.emit(this.note);
      }, 2000);
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateNote.$$deletedCode;
  }

  updateAccess(access: Array<string>): void {
    this.note.access = access;
  }

}
