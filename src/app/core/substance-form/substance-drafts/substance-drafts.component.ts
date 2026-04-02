import { Component, OnInit, Inject } from '@angular/core';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UtilsService } from '@gsrs-core/utils';
import { Sort } from '@angular/material/sort';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ValidationMessage } from '@gsrs-core/substance-form/substance-form.model'

enum SubmissionStatus {
  NONE,
  CANNOT_BE_SUBMITTED,
  IN_PROGRESS,
  SUCCESS,
  ERROR
}

enum FormState {
  DRAFT_LIST,
  VALIDATION_RESULTS,
  SUBMISSION
}

@Component({
    selector: 'app-substance-drafts',
    templateUrl: './substance-drafts.component.html',
    styleUrls: ['./substance-drafts.component.scss'],
    standalone: false
})
export class SubstanceDraftsComponent implements OnInit {
  draft: SubstanceDraft;
  displayedColumns: string[] = ['select', 'delete', 'type', 'name', 'uuid', 'date', 'load'];

  json: any;
  values: Array<any>;
  filtered: Array<any>;
  selectedKeys: Array<string> = [];
  onlyRegister = false;
  onlyCurrent = false;
  downloadJsonHref: any;
  fileName: string;
  filename: string;
  view = 'edit';
  file: any;
  uuid: string;

  formState: FormState = FormState.DRAFT_LIST;
  isLoading: boolean = false;
  validatedDrafts: Array<any> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    private substanceService: SubstanceService,
    public dialogRef: MatDialogRef<SubstanceDraftsComponent>,
    private utilsService: UtilsService,
    private sanitizer: DomSanitizer,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.view = data.view || null;
    this.data = data;
  }

  ngOnInit(): void {
    if (!this.view || this.data.view !== 'user') {
      this.json = this.substanceFormService.cleanSubstance();
      this.uuid = this.json.uuid;

    }

    this.fetchDrafts();
    const time = new Date().getTime();
    this.fileName = 'gsrs-drafts-' + time;
    this.download();
  }


  download() {
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(this.values)));
    this.downloadJsonHref = uri;
  }

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  readFile() {
    var reader = new FileReader();
    reader.onload = (e) => {
      const file = e.target.result;
        this.filtered = JSON.parse(<string>file);
        this.values = JSON.parse(<string>file);
    };
    reader.readAsText(this.file);
}


  filterToggle(value:string) {
    if (value === 'register') {
      this.onlyRegister = !this.onlyRegister;
    } else {
      this.onlyCurrent = !this.onlyCurrent;
    }

    this.filtered = this.values;
    if (this.onlyCurrent) {
      const isNewRegistration = !this.data || !this.data.uuid;
      this.filtered = this.filtered.filter(obj => {
        if(this.uuid) {
          return obj.uuid == this.uuid || (isNewRegistration && obj.uuid === 'register');
        } else if (this.json && this.json.uuid){
          return obj.uuid == this.json.uuid || (isNewRegistration && obj.uuid === 'register');
        } else {
          return false;
        }
    });
    }

    if (this.onlyRegister) {
      this.filtered = this.filtered.filter(function( obj ) {
        return obj.uuid === 'register';
    });
    }

  }


  useDraft(index) {
    this.dialogRef.close(index);
  }


  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
    //  this.filtered = data;
      return;
    }
    const data = this.filtered.slice();
    this.filtered = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.utilsService.compare(a[sort.active] ? a[sort.active] : null, b[sort.active] ? b[sort.active] : null, isAsc);
    });
  }

  toggleDraft(draft: any, checked: boolean): void {
    if (!this.selectedKeys.includes(draft.key) && checked) {
      this.selectedKeys.push(draft.key);
    } else if (this.selectedKeys.includes(draft.key) && !checked) {
      this.selectedKeys = this.selectedKeys.filter(key => key !== draft.key);
    }
  }

  processValidationMessages(substanceCopy, results): void {
    if (results.validationMessages) {
      for (let i = 0; i < substanceCopy.references.length; i++) {
        const ref = substanceCopy.references[i];
        if (ref.docType !== 'SYSTEM') {
          if ((!ref.citation || ref.citation === '') || (!ref.docType || ref.docType === '')) {
            const invalidReferenceMessage: ValidationMessage = {
              actionType: 'frontEnd',
              appliedChange: false,
              links: [],
              message: 'All references require a non-empty source type and text/citation value',
              messageType: 'WARNING',
              suggestedChange: true
            };
            results.validationMessages.push(invalidReferenceMessage);
            break;
          }
        }
      }
      if (substanceCopy.properties) {
        for (let i = 0; i < substanceCopy.properties.length; i++) {
          const prop = substanceCopy.properties[i];
          if (!prop.propertyType || !prop.name) {
            const invalidPropertyMessage: ValidationMessage = {
              actionType: 'frontEnd',
              appliedChange: false,
              links: [],
              message: 'Property #' + (i + 1) + ' requires a non-empty name and type',
              messageType: 'ERROR',
              suggestedChange: true
            };
            results.validationMessages.push(invalidPropertyMessage);
            results.valid = false;
          }
        }
      }
      if (substanceCopy.relationships) {
        for (let i = 0; i < substanceCopy.relationships.length; i++) {
          const relationship = substanceCopy.relationships[i];
          if (!relationship.relatedSubstance || !relationship.type || relationship.type === '') {
            const invalidRelationshipMessage: ValidationMessage = {
              actionType: 'frontEnd',
              appliedChange: false,
              links: [],
              message: 'Relationship  #' + (i + 1) + ' requires a non-empty related substance and type',
              messageType: 'ERROR',
              suggestedChange: true
            };
            results.validationMessages.push(invalidRelationshipMessage);
            results.valid = false;
          }
        }
      }
      if (substanceCopy.polymer && substanceCopy.polymer.monomers) {
        for (let i = 0; i < substanceCopy.polymer.monomers.length; i++) {
          const prop = substanceCopy.polymer.monomers[i];
          if (!prop.monomerSubstance || (typeof prop.monomerSubstance === 'object' && Object.keys(prop.monomerSubstance).length === 0)) {
            const invalidPropertyMessage: ValidationMessage = {
              actionType: 'frontEnd',
              appliedChange: false,
              links: [],
              message: 'Monomer #' + (i + 1) + ' requires a selected substance',
              messageType: 'ERROR',
              suggestedChange: true
            };
            results.validationMessages.push(invalidPropertyMessage);
            results.valid = false;
          }
        }
      }
      if (substanceCopy.modifications && substanceCopy.modifications.physicalModifications) {
        for (let i = 0; i < substanceCopy.modifications.physicalModifications.length; i++) {
          const prop = substanceCopy.modifications.physicalModifications[i];
          let present = false;
          if (prop && prop.parameters) {
            prop.parameters.forEach(param => {
              if (param.parameterName) {
                present = true;
              }
            });
          }

          if (!prop.physicalModificationRole && !present) {
            const invalidPropertyMessage: ValidationMessage = {
              actionType: 'frontEnd',
              appliedChange: false,
              links: [],
              message: 'Physical Modification #' + (i + 1) + ' requires a modification role or valid parameter',
              messageType: 'ERROR',
              suggestedChange: true
            };
            results.validationMessages.push(invalidPropertyMessage);
            results.valid = false;
          }
        }
      }
    }
  }

  validateSelected(): void {
    this.formState = FormState.VALIDATION_RESULTS;
    this.isLoading = true;
    this.validatedDrafts = [];
    this.selectedKeys.forEach(key => {
      const draft = JSON.parse(localStorage.getItem(key));
      const validatedDraft = {
        key: key,
        json: draft,
        validationMessages: [],
        validationResult: false,
        submitStatus: SubmissionStatus.NONE,
        fileUrl: undefined
      }

      this.substanceService.validateSubstance(draft.substance).subscribe(results => {

        this.processValidationMessages(draft.substance, results);
        validatedDraft.validationMessages = results.validationMessages.filter(
          message => message.messageType.toUpperCase() === 'ERROR' || message.messageType.toUpperCase() === 'WARNING' || message.messageType.toUpperCase() === 'NOTICE'
        );
        validatedDraft.validationResult = results.valid;
        this.validatedDrafts.push(validatedDraft);

        if (this.validatedDrafts.length === this.selectedKeys.length) {
          this.isLoading = false;
        }
      }, error => {

        validatedDraft.validationMessages.push({
          messageType: 'SERVER ERROR',
          message: error.error?.message

        })

        this.validatedDrafts.push(validatedDraft);
        if (this.validatedDrafts.length === this.selectedKeys.length) {
          this.isLoading = false;
        }
      });
    })
  }

  submitValid() {
    this.formState = FormState.SUBMISSION;
    this.isLoading = true;
    let completedCount = 0;
    const submittableDrafts = this.validatedDrafts.filter(draft => draft.validationResult);
    this.validatedDrafts.forEach(draft => {
      if (!draft.validationResult) {
        draft.submitStatus = SubmissionStatus.CANNOT_BE_SUBMITTED;
      } else {
        draft.submitStatus = SubmissionStatus.IN_PROGRESS;
        const result = {
          isSuccessfull: false,
          validationMessages: [],
          serverError: undefined
        }
        this.substanceService.saveSubstance(draft.json.substance, 'import').subscribe(substance => {
          draft.submitStatus = SubmissionStatus.SUCCESS;
          draft.fileUrl = substance.fileUrl;
          completedCount++;
          if (completedCount === submittableDrafts.length) {
            this.isLoading = false;
          }
        }, error => {
          draft.submitStatus = SubmissionStatus.ERROR;
          result.isSuccessfull = false;
          if (error && error.error && error.error.validationMessages) {
            result.validationMessages = error.error.validationMessages;
          } else {
            result.serverError = error;
          }
          completedCount++;
          if (completedCount === submittableDrafts.length) {
            this.isLoading = false;
          }
        });
      }
    })
  }


  fixLink(link: string) {
    return this.substanceService.oldLinkFix(link);
  }

  deleteDraft(draft: any): void {
    localStorage.removeItem(draft.key);
    this.filtered = this.filtered.filter(function( obj ) {
      return obj.key !== draft.key;
    });

    this.values = this.values.filter(function( obj ) {
      return obj.key !== draft.key;
    });

  }

  onFileSelect(event): void {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.filename = this.file.name;
    //  this.uploadForm.get('file').setValue(this.file);
      this.readFile()
    }
  }

  openInput(): void {
    document.getElementById('fileInput').click();
  }

  fetchDrafts() {

     this.values = [];
      let keys = Object.keys(localStorage);
      let i = keys.length;

      while ( i-- ) {
        if (keys[i].startsWith('gsrs-draft-')){
          const entry = JSON.parse(localStorage.getItem(keys[i]));
          entry.key = keys[i];
          entry.fromNow = moment(entry.date).fromNow();
          this.values.push( entry );

        }
      }
      this.filtered = this.values.sort((a, b) => {
        return b.date - a.date;
      });
      this.selectedKeys = [];
  }


  saveDraft() {
    this.json = this.substanceFormService.cleanSubstance();
    const time = new Date().getTime();
    const file = 'gsrs-draft-' + time;
    const uuid = this.json.uuid ? this.json.uuid : 'register';
    const type = this.json.substanceClass;
    let primary = null;
    this.json.names.forEach(name => {
      if (name.displayName) {
        primary = name.name;
      }
    });
    if (!primary && this.json.names.length > 0) {
      primary = this.json.names[0].name;
    }

    let draft = {
      'uuid': uuid,
      'date': time,
      'type': type,
      'name': primary,
      'substance': this.json
    }

   localStorage.setItem(file, JSON.stringify(draft));

  }

  hasValidDrafts(): boolean {
    return this.validatedDrafts.some(draft => draft.validationResult)
  }


  close() {
    this.dialogRef.close();
  }

  public readonly SubmissionStatus = SubmissionStatus
  public readonly FormState = FormState
}




export interface SubstanceDraft {
  key: string;
  uuid: any;
  date: string;
  type: string;
  name?: string;
  substance: any;
  auto?: boolean;
  file?: any;
  fromNow?: string;
}
