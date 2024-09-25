import { Injectable } from '@angular/core';
import { SubstanceCode } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { Observable } from 'rxjs';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';

@Injectable()
export class SubstanceFormCodesService extends SubstanceFormServiceBase<Array<SubstanceCode>> {

  constructor(
    public substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.codes == null) {
        this.substance.codes = [];
      }
      this.substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.codes);
    });
    this.subscriptions.push(subscription);
  }

  get substanceCodes(): Observable<Array<SubstanceCode>> {
    return this.propertyEmitter.asObservable();
  }

  addSubstanceCode(code?: SubstanceCode): void {
    if (code === undefined) {
      code = {
        references: [],
        access: []
      };
    }
    this.substance.codes.unshift(code);
    this.propertyEmitter.next(this.substance.codes);
  }

  deleteSubstanceCode(code: SubstanceCode): void {
    const subCodeIndex = this.substance.codes.findIndex(subCode => code.$$deletedCode === subCode.$$deletedCode);
    if (subCodeIndex > -1) {
      this.substance.codes.splice(subCodeIndex, 1);
      this.propertyEmitter.next(this.substance.codes);
    }
  }
}
