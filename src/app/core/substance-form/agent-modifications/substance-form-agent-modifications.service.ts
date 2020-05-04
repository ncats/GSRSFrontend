import { Injectable } from '@angular/core';
import { SubstanceFormAgentModificationsModule } from './substance-form-agent-modifications.module';
import { SubstanceFormService } from '../substance-form.service';
import { Observable, ReplaySubject } from 'rxjs';
import { AgentModification } from '@gsrs-core/substance/substance.model';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';

@Injectable({
  providedIn: SubstanceFormAgentModificationsModule
})
export class SubstanceFormAgentModificationsService extends SubstanceFormServiceBase<Array<AgentModification>> {

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
      if (!this.substance.modifications.agentModifications) {
        this.substance.modifications.agentModifications = [];
      }
      this.substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.modifications.agentModifications);
    });
    this.subscriptions.push(subscription);
  }

  get substanceAgentModifications(): Observable<Array<AgentModification>> {
    return this.propertyEmitter.asObservable();
  }

  addSubstanceAgentModification(): void {
    const newAgentModifications: AgentModification = {};
    this.substance.modifications.agentModifications.unshift(newAgentModifications);
    this.propertyEmitter.next(this.substance.modifications.agentModifications);
  }

  deleteSubstanceAgentModification(agentModification: AgentModification): void {
    const agentModIndex = this.substance.modifications.agentModifications.findIndex(
      agentMod => agentModification.$$deletedCode === agentMod.$$deletedCode);
    if (agentModIndex > -1) {
      this.substance.modifications.agentModifications.splice(agentModIndex, 1);
      this.propertyEmitter.next(this.substance.modifications.agentModifications);
    }
  }
}
