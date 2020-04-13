import { Injectable } from '@angular/core';
import { SubstanceFormCodesModule } from './substance-form-codes.module';
import { SubstanceDetail, SubstanceCode } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { ReplaySubject, Observable } from 'rxjs';

@Injectable({
  providedIn: SubstanceFormCodesModule
})
export class SubstanceFormCodesService {
  private substance: SubstanceDetail;
  private codesEmitter = new ReplaySubject<Array<SubstanceCode>>();

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.codes == null) {
        this.substance.codes = [];
      }
      this.substanceFormService.resetState();
      this.codesEmitter.next(this.substance.codes);
    });
  }

  get substanceCodes(): Observable<Array<SubstanceCode>> {
    return this.codesEmitter.asObservable();
  }

  addSubstanceCode(): void {
    const newCode: SubstanceCode = {
      references: [],
      access: []
    };
    this.substance.codes.unshift(newCode);
    this.codesEmitter.next(this.substance.codes);
  }

  deleteSubstanceCode(code: SubstanceCode): void {
    const subCodeIndex = this.substance.codes.findIndex(subCode => code.$$deletedCode === subCode.$$deletedCode);
    if (subCodeIndex > -1) {
      this.substance.codes.splice(subCodeIndex, 1);
      this.codesEmitter.next(this.substance.codes);
    }
  }
}
