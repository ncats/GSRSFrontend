import { Injectable } from '@angular/core';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormService } from '../substance-form.service';
import { Observable, ReplaySubject } from 'rxjs';
import { Monomer } from '@gsrs-core/substance/substance.model';
import { SubstanceFormMonomersModule } from './substance-form-monomers.module';

@Injectable({
  providedIn: SubstanceFormMonomersModule
})
export class SubstanceFormMonomersService extends SubstanceFormServiceBase {

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
    this.propertyEmitter = new ReplaySubject<Array<Monomer>>();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.nucleicAcid) {
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
