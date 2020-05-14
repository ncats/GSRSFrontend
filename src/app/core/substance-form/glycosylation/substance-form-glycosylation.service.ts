import { Injectable } from '@angular/core';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormService } from '../substance-form.service';
import { Observable } from 'rxjs';
import { Glycosylation } from '@gsrs-core/substance/substance.model';

@Injectable()
export class SubstanceFormGlycosylationService extends SubstanceFormServiceBase<Glycosylation> {

  constructor(
    public substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const substanceSubscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.protein) {
        if (this.substance.protein.glycosylation == null) {
          this.substance.protein.glycosylation = {};
        }
        this.substanceFormService.resetState();
        this.propertyEmitter.next(this.substance.protein.glycosylation);
      }
    });
    this.subscriptions.push(substanceSubscription);
    const glycosylationUpdatedSubscription = this.substanceFormService.glycosylationUpdated().subscribe(glycosylation => {
      this.propertyEmitter.next(glycosylation);
    });
    this.subscriptions.push(glycosylationUpdatedSubscription);
  }

  get substanceGlycosylation(): Observable<Glycosylation> {
    return this.propertyEmitter.asObservable();
  }

  emitGlycosylationUpdate(): void {
    this.substanceFormService.recalculateAllSites('glycosylation');
    this.propertyEmitter.next(this.substance.protein.glycosylation);
  }
}
