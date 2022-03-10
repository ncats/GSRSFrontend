import { Injectable } from '@angular/core';
import { SubstanceFormServiceBase } from '../../substance-form/base-classes/substance-form-service-base';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
import { Observable } from 'rxjs';
import { SpecifiedSubstanceG4mProcess } from '@gsrs-core/substance/substance.model';

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class SubstanceFormSsg4mProcessService extends SubstanceFormServiceBase<Array<SpecifiedSubstanceG4mProcess>> {

  constructor(
    public substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      alert(this.substance);
      if (!this.substance.specifiedSubstanceG4m) {
        this.substance.specifiedSubstanceG4m = {};
      }
      if (!this.substance.specifiedSubstanceG4m.process) {
        this.substance.specifiedSubstanceG4m.process = [];
      }
      this.substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process);
    });
    this.subscriptions.push(subscription);
  }

  get specifiedSubstanceG4mProcess(): Observable<Array<SpecifiedSubstanceG4mProcess>> {
    return this.propertyEmitter.asObservable();
  }

  addProcess(): void {
    const newProcess: SpecifiedSubstanceG4mProcess = {
      references: [],
      access: []
    };
    this.substance.specifiedSubstanceG4m.process.unshift(newProcess);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process);
  }

  deleteProcess(process: SpecifiedSubstanceG4mProcess): void {
    const processIndex = this.substance.specifiedSubstanceG4m.process.findIndex(pro => pro.$$deletedCode === pro.$$deletedCode);
    if (processIndex > -1) {
      this.substance.specifiedSubstanceG4m.process.splice(processIndex, 1);
      this.propertyEmitter.next(this.substance.specifiedSubstanceG4m.process);
    }
  }
}
