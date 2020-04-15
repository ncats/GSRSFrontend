import { Injectable } from '@angular/core';
import { SubstanceFormCodesModule } from './substance-form-codes.module';
import { SubstanceCode } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { ReplaySubject, Observable } from 'rxjs';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';

@Injectable({
  providedIn: SubstanceFormCodesModule
})
export class SubstanceFormCodesService extends SubstanceFormServiceBase {

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
    this.propertyEmitter = new ReplaySubject<Array<SubstanceCode>>();
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

  addSubstanceCode(): void {
    const newCode: SubstanceCode = {
      references: [],
      access: []
    };
    this.substance.codes.unshift(newCode);
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
