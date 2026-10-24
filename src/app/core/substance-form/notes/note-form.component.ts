import { ChangeDetectionStrategy, Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SubstanceNote } from '../../substance/substance.model';
import { FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../utils/utils.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AccessManagerComponent } from '@gsrs-core/substance-form/access-manager/access-manager.component';
import { AuditInfoComponent } from '@gsrs-core/substance-form/audit-info/audit-info.component';
import { DomainReferencesComponent } from '@gsrs-core/substance-form/references/domain-references/domain-references.component';

@Component({
    selector: 'app-note-form',
    templateUrl: './note-form.component.html',
    styleUrls: ['./note-form.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatTooltipModule, AccessManagerComponent, AuditInfoComponent, DomainReferencesComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
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
      }, 20);
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
