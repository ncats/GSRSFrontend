import { Injectable } from '@angular/core';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormService } from '../substance-form.service';
import { Observable } from 'rxjs';
import { Monomer } from '@gsrs-core/substance/substance.model';

@Injectable()
export class SubstanceFormMonomersService extends SubstanceFormServiceBase<Array<Monomer>> {

  constructor(
    public substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.polymer) {
        if (this.substance.polymer.monomers == null) {
          this.substance.polymer.monomers = [];
        }
        this.substanceFormService.resetState();
        this.propertyEmitter.next(this.substance.polymer.monomers);
      }
    });
    this.subscriptions.push(subscription);
  }

  get substanceMonomers(): Observable<Array<Monomer>> {
    return this.propertyEmitter.asObservable();
  }

  addSubstanceMonomer(): void {
    const newMix: Monomer = {};
    this.substance.polymer.monomers.unshift(newMix);
    this.propertyEmitter.next(this.substance.polymer.monomers);
  }

  deleteSubstanceMonomer(mix: Monomer): void {
    const subNameIndex = this.substance.polymer.monomers.findIndex(subName => mix.$$deletedCode === subName.$$deletedCode);
    if (subNameIndex > -1) {
      this.substance.polymer.monomers.splice(subNameIndex, 1);
      this.propertyEmitter.next(this.substance.polymer.monomers);
    }
  }
}
