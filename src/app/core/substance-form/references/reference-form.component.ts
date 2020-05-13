import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { SubstanceReference } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../utils/utils.service';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceFormReferencesService } from './substance-form-references.service';

@Component({
  selector: 'app-reference-form',
  templateUrl: './reference-form.component.html',
  styleUrls: ['./reference-form.component.scss']
})
export class ReferenceFormComponent implements OnInit, AfterViewInit {
  @Input() reference: SubstanceReference;
  @Output() referenceDeleted = new EventEmitter<SubstanceReference>();
  @Input() hideDelete = false;
  deleteTimer: any;

  constructor(
    private cvService: ControlledVocabularyService,
    private utilsService: UtilsService,
    private substanceFormReferencesService: SubstanceFormReferencesService,
    private substanceFormService: SubstanceFormService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  updateAccess(access: Array<string>): void {
    this.reference.access = access;
  }

  updateTags(tags: Array<string>): void {
    this.reference.tags = tags;
  }

  get isValid(): boolean {
    if (this.reference.docType
      && this.reference.citation) {
        return true;
    } else {
      return false;
    }
  }

  deleteReference(): void {
    this.reference.$$deletedCode = this.utilsService.newUUID();
    if (!this.reference.docType
      && !this.reference.citation
      && !this.reference.uploadedFile
    ) {
      this.deleteTimer = setTimeout(() => {
        this.referenceDeleted.emit(this.reference);
      }, 2000);
    } else {
      this.substanceFormReferencesService.emitReferencesUpdate();
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.reference.$$deletedCode;
    this.substanceFormReferencesService.emitReferencesUpdate();
  }

  fileSelected(file: File): void {
    if (file != null) {
      this.utilsService.uploadFile(file).subscribe(response => {
        this.reference.uploadedFile = response;
      });
    }
  }

  downloadDocument(url: string): void {
    this.substanceFormService.bypassUpdateCheck();
    window.open(url);
  }

}
