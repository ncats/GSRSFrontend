import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { SubstanceReference } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';
import { ReferenceApplied } from '../reference-form/reference-applied';
import { SubstanceFormService } from '../substance-form.service';

@Component({
  selector: 'app-reference-form',
  templateUrl: './reference-form.component.html',
  styleUrls: ['./reference-form.component.scss']
})
export class ReferenceFormComponent implements OnInit, AfterViewInit {
  @Input() reference: SubstanceReference;
  documentTypes: Array<VocabularyTerm> = [];
  documentTypeControl: FormControl;
  citationControl: FormControl;
  publicDomainControl: FormControl;
  urlControl: FormControl;
  idControl: FormControl;
  referenceApplied: ReferenceApplied;

  constructor(
    private cvService: ControlledVocabularyService,
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

    if (this.reference.uuid != null) {
      this.referenceApplied = new ReferenceApplied(this.reference.uuid, this.substanceFormService);
    }
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
    console.log('hello');
    return this.documentTypeControl.valid
      && this.citationControl.valid
      && this.publicDomainControl.valid
      && this.urlControl.valid
      && this.idControl.valid;
  }

}
