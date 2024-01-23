import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SubstanceCode } from '@gsrs-core/substance';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { VocabularyTerm } from '@gsrs-core/controlled-vocabulary';
import { UtilsService } from '@gsrs-core/utils';

@Component({
  selector: 'app-code-form',
  templateUrl: './code-form.component.html',
  styleUrls: ['./code-form.component.scss']
})
export class CodeFormComponent implements OnInit {
  private privateCode: SubstanceCode;
  @Output() codeDeleted = new EventEmitter<SubstanceCode>();
  codeSystemList: Array<VocabularyTerm> = [];
  codeSystemDictionary: { [termValue: string]: VocabularyTerm };
  codeSystemType: string;
  codeTypeList: Array<VocabularyTerm> = [];
  deleteTimer: any;

  constructor(
    private cvService: ControlledVocabularyService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  @Input()
  set code(code: SubstanceCode) {
    this.privateCode = code;
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
    this.privateCode.$$deletedCode = this.utilsService.newUUID();
    if (!this.privateCode.codeSystem
      && !this.privateCode.type
      && !this.privateCode.code
    ) {
      this.deleteTimer = setTimeout(() => {
        this.codeDeleted.emit(this.privateCode);
      }, 2000);
    }
  }

  trimWhitespace(value) {
    this.code.url = value;
    this.privateCode.url = this.privateCode.url.replace(/[\u200A|\u2009|\u2006|\u2008]/g, ' ').trim();
    this.privateCode.url = value.trim().trim().trim();
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateCode.$$deletedCode;
  }

  setCodeSystemType(event?: any): void {
    if (event) {
      this.code.codeSystem = event;
    }
    if (this.privateCode != null && this.codeSystemDictionary != null) {
      this.codeSystemType = this.codeSystemDictionary[this.privateCode.codeSystem]
        && this.codeSystemDictionary[this.privateCode.codeSystem].systemCategory || '';
    }
  }

  updateAccess(access: Array<string>): void {
    this.code.access = access;
  }

}
