import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SubstanceCode } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';
import { UtilsService } from '../../utils/utils.service';
import { ConfigService } from '@gsrs-core/config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { AccessManagerComponent } from '@gsrs-core/substance-form/access-manager/access-manager.component';
import { AuditInfoComponent } from '@gsrs-core/substance-form/audit-info/audit-info.component';
import { CvInputComponent } from '@gsrs-core/substance-form/cv-input/cv-input.component';
import { DomainReferencesComponent } from '@gsrs-core/substance-form/references/domain-references/domain-references.component';

@Component({
    selector: 'app-code-form',
    templateUrl: './code-form.component.html',
    styleUrls: ['./code-form.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatTooltipModule, MatInputModule, AccessManagerComponent, AuditInfoComponent, CvInputComponent, DomainReferencesComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeFormComponent implements OnInit {
  private privateCode: SubstanceCode;
  @Output() codeDeleted = new EventEmitter<SubstanceCode>();
  codeSystemList: Array<VocabularyTerm> = [];
  codeSystemDictionary: { [termValue: string]: VocabularyTerm };
  codeSystemType: string;
  codeTypeList: Array<VocabularyTerm> = [];
  deleteTimer: any;
  viewFull = true;
  codeSystemMapping: any;

  constructor(
    private cvService: ControlledVocabularyService,
    private utilsService: UtilsService,
    public configService: ConfigService,
    private cdr: ChangeDetectorRef

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

  @Input()
  set show(val: boolean) {
    if (val != null) {
     this.viewFull = val;
    }
  }

  get show(): boolean {
    return this.viewFull || null;
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('CODE_SYSTEM', 'CODE_TYPE').subscribe(response => {
      this.codeSystemList = response['CODE_SYSTEM'].list;
      this.codeSystemDictionary = response['CODE_SYSTEM'].dictionary;
      this.setCodeSystemType();
      this.codeTypeList = response['CODE_TYPE'].list;
      this.cdr.markForCheck();
    });
    if (this.configService.configData && this.configService.configData.codeSystemMapping) {
      //This config object is meant to map certain code system values with an automatically filled out code value on selection.
      this.codeSystemMapping = this.configService.configData.codeSystemMapping;
    }
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

    if (this.codeSystemMapping && this.codeSystemMapping[this.code.codeSystem]) {
      this.code.code = this.codeSystemMapping[this.code.codeSystem];
    }
  }

  updateAccess(access: Array<string>): void {
    this.code.access = access;
  }

}
