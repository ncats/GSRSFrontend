import { Injectable } from '@angular/core';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormService } from '../substance-form.service';
import { MixtureComponents } from '@gsrs-core/substance/substance.model';
import { Observable } from 'rxjs';

@Injectable()
export class SubstanceFormMixtureComponentsService extends SubstanceFormServiceBase<Array<MixtureComponents>> {

  constructor(
    public substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.mixture != null) {
        if (this.substance.mixture.components == null) {
          this.substance.mixture.components = [];
        }
        this.substanceFormService.resetState();
        this.propertyEmitter.next(this.substance.mixture.components);
      }
    });
    this.subscriptions.push(subscription);
  }

  get substanceMixtureComponents(): Observable<Array<MixtureComponents>> {
    return this.propertyEmitter.asObservable();
  }

  addSubstanceMixtureComponent(): void {
    const newMix: MixtureComponents = {};
    this.substance.mixture.components.unshift(newMix);
    this.propertyEmitter.next(this.substance.mixture.components);
  }

  deleteSubstanceMixtureComponent(mix: MixtureComponents): void {
    const subNameIndex = this.substance.mixture.components.findIndex(subName => mix.$$deletedCode === subName.$$deletedCode);
    if (subNameIndex > -1) {
      this.substance.mixture.components.splice(subNameIndex, 1);
      this.propertyEmitter.next(this.substance.mixture.components);
    }
  }
}
