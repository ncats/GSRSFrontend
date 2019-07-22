import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SubstanceCode } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-code-form',
  templateUrl: './code-form.component.html',
  styleUrls: ['./code-form.component.scss']
})
export class CodeFormComponent implements OnInit {
  private privateCode: SubstanceCode;
  @Output() codeDeleted = new EventEmitter<SubstanceCode>();
  codeSystemControl = new FormControl('', [Validators.required]);
  codeSystemList: Array<VocabularyTerm> = [];
  codeSystemDictionary: { [termValue: string]: VocabularyTerm };
  isDeleted = false;
  codeSystemType: string;
  codeTypeList: Array<VocabularyTerm> = [];
  codeTypeControl = new FormControl('');
  codeControl = new FormControl('');
  urlControl = new FormControl('');
  codeTextControl = new FormControl('');

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  @Input()
  set code(code: SubstanceCode) {
    this.privateCode = code;
    this.codeSystemControl.setValue(this.privateCode.codeSystem);
    this.setCodeSystemType();
    this.codeSystemControl.valueChanges.subscribe(value => {
      this.privateCode.codeSystem = value;
      this.setCodeSystemType();
    });
    this.codeTypeControl.setValue(this.code.type);
    this.codeTypeControl.valueChanges.subscribe(value => {
      this.code.type = value;
    });
    this.codeControl.setValue(this.code.code);
    this.codeControl.valueChanges.subscribe(value => {
      this.code.code = value;
    });
    this.urlControl.setValue(this.code.url);
    this.urlControl.valueChanges.subscribe(value => {
      this.code.url = value;
    });
    this.codeTextControl.setValue(this.code.comments);
    this.codeTextControl.valueChanges.subscribe(value => {
      this.code.comments = value;
    });
  }

  get code(): SubstanceCode {
    return this.privateCode;
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('CODE_SYSTEM', 'CODE_TYPE').subscribe(response => {
      this.codeSystemList = response['CODE_SYSTEM'].list;
      this.codeSystemDictionary = response['CODE_SYSTEM'].dictionary;
      this.setCodeSystemType();
      this.codeTypeList = response['CODE_TYPE'].list;
    });
  }

  deleteCode(): void {
    this.isDeleted = true;
    setTimeout(() => {
      this.codeDeleted.emit(this.code);
    }, 500);
  }

  private setCodeSystemType(): void {
    if (this.privateCode != null && this.codeSystemDictionary != null) {
      this.codeSystemType = this.codeSystemDictionary[this.privateCode.codeSystem]
        && this.codeSystemDictionary[this.privateCode.codeSystem].systemCategory || '';
    }
  }

  updateAccess(access: Array<string>): void {
    this.code.access = access;
  }

}
