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

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
  }

  @Input()
  set code(code: SubstanceCode) {
    this.privateCode = code;
  }

  get code(): SubstanceCode {
    return this.privateCode;
  }

}
