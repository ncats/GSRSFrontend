import { Injectable } from '@angular/core';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormPhysicalModificationsModule } from './substance-form-physical-modifications.module';
import { SubstanceFormService } from '../substance-form.service';
import { ReplaySubject, Observable } from 'rxjs';
import { PhysicalModification } from '@gsrs-core/substance/substance.model';

@Injectable({
  providedIn: SubstanceFormPhysicalModificationsModule
})
export class SubstanceFormPhysicalModificationsService extends SubstanceFormServiceBase<Array<PhysicalModification>> {

  constructor(
    public substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (!this.substance.modifications) {
        this.substance.modifications = {};
      }
      if (!this.substance.modifications.physicalModifications) {
        this.substance.modifications.physicalModifications = [];
      }
      this.substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.modifications.physicalModifications);
    });
    this.subscriptions.push(subscription);
  }

  get substancePhysicalModifications(): Observable<Array<PhysicalModification>> {
    return this.propertyEmitter.asObservable();
  }

  addSubstancePhysicalModification(): void {
    const newPhysicalModifications: PhysicalModification = {};
    this.substance.modifications.physicalModifications.unshift(newPhysicalModifications);
    this.propertyEmitter.next(this.substance.modifications.physicalModifications);
  }

  deleteSubstancePhysicalModification(physicalModification: PhysicalModification): void {
    const physicalModIndex = this.substance.modifications.physicalModifications.findIndex(
      physicalMod => physicalModification.$$deletedCode === physicalMod.$$deletedCode);
    if (physicalModIndex > -1) {
      this.substance.modifications.physicalModifications.splice(physicalModIndex, 1);
      this.propertyEmitter.next(this.substance.modifications.physicalModifications);
    }
  }
}
