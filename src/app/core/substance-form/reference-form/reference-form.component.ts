import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { SubstanceReference } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../utils/utils.service';
import { SubstanceFormService } from '../substance-form.service';

@Component({
  selector: 'app-reference-form',
  templateUrl: './reference-form.component.html',
  styleUrls: ['./reference-form.component.scss']
})
export class ReferenceFormComponent implements OnInit, AfterViewInit {
  @Input() reference: SubstanceReference;
  @Output() referenceDeleted = new EventEmitter<SubstanceReference>();
  documentTypes: Array<VocabularyTerm> = [];
  documentTypeControl: FormControl;
  citationControl: FormControl;
  publicDomainControl: FormControl;
  urlControl: FormControl;
  idControl: FormControl;
  deleteTimer: any;

  constructor(
    private cvService: ControlledVocabularyService,
    private utilsService: UtilsService,
    private substanceFormService: SubstanceFormService
  ) { }

  ngOnInit() {
    this.documentTypeControl = new FormControl(this.reference.docType, [Validators.required]);
    this.documentTypeControl.valueChanges.subscribe(value => {
      this.reference.docType = value;
    });

    this.citationControl = new FormControl(this.reference.citation, [Validators.required]);
    this.citationControl.valueChanges.subscribe(value => {
      this.reference.citation = value;
    });

    this.publicDomainControl = new FormControl(this.reference.publicDomain);
    this.publicDomainControl.valueChanges.subscribe(value => {
      this.reference.publicDomain = value;
    });

    this.urlControl = new FormControl(this.reference.url);
    this.urlControl.valueChanges.subscribe(value => {
      this.reference.url = value;
    });

    this.idControl = new FormControl(this.reference.id);
    this.idControl.valueChanges.subscribe(value => {
      this.reference.id = value;
    });

    this.getVocabularies();
  }

  ngAfterViewInit() {
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('DOCUMENT_TYPE').subscribe(response => {
      this.documentTypes = response['DOCUMENT_TYPE'].list;
    });
  }

  updateAccess(access: Array<string>): void {
    this.reference.access = access;
  }

  updateTags(tags: Array<string>): void {
    this.reference.tags = tags;
  }

  get isValid(): boolean {
    return this.documentTypeControl.valid
      && this.citationControl.valid
      && this.publicDomainControl.valid
      && this.urlControl.valid
      && this.idControl.valid;
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
      this.substanceFormService.emitReferencesUpdate();
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.reference.$$deletedCode;
  }

  fileSelected(file: File): void {
    if (file != null) {
      this.utilsService.uploadFile(file).subscribe(response => {
        this.reference.uploadedFile = response;
      });
    }
  }

}
