import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceCode } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-substance-form-codes',
  templateUrl: './substance-form-codes.component.html',
  styleUrls: ['./substance-form-codes.component.scss']
})
export class SubstanceFormCodesComponent extends SubstanceFormSectionBase implements OnInit, AfterViewInit {
  codes: Array<SubstanceCode>;

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Codes');
  }

  ngAfterViewInit() {
    this.substanceFormService.substanceCodes.subscribe(codes => {
      this.codes = codes;
    });
  }

  addCode(): void {
    this.substanceFormService.addSubstanceCode();
  }

  deleteCode(code: SubstanceCode): void {
    this.substanceFormService.deleteSubstanceCode(code);
  }

}
