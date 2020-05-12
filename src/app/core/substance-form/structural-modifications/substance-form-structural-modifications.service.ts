import { Injectable } from '@angular/core';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormService } from '../substance-form.service';
import { Observable } from 'rxjs';
import { StructuralModification } from '@gsrs-core/substance/substance.model';

@Injectable()
export class SubstanceFormStructuralModificationsService extends SubstanceFormServiceBase<Array<StructuralModification>> {

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
      if (!this.substance.modifications.structuralModifications) {
        this.substance.modifications.structuralModifications = [];
      }
      this.substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.modifications.structuralModifications);
    });
    this.subscriptions.push(subscription);
  }

  get substanceStructuralModifications(): Observable<Array<StructuralModification>> {
    return this.propertyEmitter.asObservable();
  }

  addSubstanceStructuralModification(): void {
    if (!this.substance.modifications) {
      this.substance.modifications = {};
    }
    if (!this.substance.modifications.structuralModifications) {
      this.substance.modifications.structuralModifications = [];
    }
    const newStructuralModifications: StructuralModification = { references: [], sites: [], access: [] };
    this.substance.modifications.structuralModifications.unshift(newStructuralModifications);
    this.propertyEmitter.next(this.substance.modifications.structuralModifications);
  }

  deleteSubstanceStructuralModification(structuralModification: StructuralModification): void {
    const structuralModIndex = this.substance.modifications.structuralModifications.findIndex(
      structuralMod => structuralModification.$$deletedCode === structuralMod.$$deletedCode);
    if (structuralModIndex > -1) {
      this.substance.modifications.structuralModifications.splice(structuralModIndex, 1);
      this.propertyEmitter.next(this.substance.modifications.structuralModifications);
    }
  }
}
