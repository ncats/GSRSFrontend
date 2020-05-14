import { Injectable } from '@angular/core';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { StructurallyDiverse } from '@gsrs-core/substance/substance.model';
import { Observable } from 'rxjs';

@Injectable()
export class SubstanceFormStructurallyDiverseService extends SubstanceFormServiceBase<StructurallyDiverse> {

  constructor(
    public substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.structurallyDiverse == null) {
        this.substance.structurallyDiverse = { $$diverseType: 'whole', part: ['WHOLE'] };
      }
      this.substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.structurallyDiverse);
    });
    this.subscriptions.push(subscription);
  }

  get substanceStructurallyDiverse(): Observable<StructurallyDiverse> {
    return this.propertyEmitter.asObservable();
  }

  emitStructurallyDiverseUpdate(): void {
    this.propertyEmitter.next(this.substance.structurallyDiverse);
  }
}
