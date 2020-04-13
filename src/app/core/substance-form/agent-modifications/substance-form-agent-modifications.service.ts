import { Injectable, OnDestroy } from '@angular/core';
import { SubstanceFormAgentModificationsModule } from './substance-form-agent-modifications.module';
import { SubstanceFormService } from '../substance-form.service';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { SubstanceDetail, AgentModification } from '@gsrs-core/substance/substance.model';

@Injectable({
  providedIn: SubstanceFormAgentModificationsModule
})
export class SubstanceFormAgentModificationsService implements OnDestroy {
  private substance: SubstanceDetail;
  private modificationsEmitter = new ReplaySubject<Array<AgentModification>>();
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (!this.substance.modifications) {
        this.substance.modifications = {};
      }
      if (!this.substance.modifications.agentModifications) {
        this.substance.modifications.agentModifications = [];
      }
      this.substanceFormService.resetState();
      this.modificationsEmitter.next(this.substance.modifications.agentModifications);
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  get substanceAgentModifications(): Observable<Array<AgentModification>> {
    return this.modificationsEmitter.asObservable();
  }

  addSubstanceAgentModification(): void {
    const newAgentModifications: AgentModification = {};
    this.substance.modifications.agentModifications.unshift(newAgentModifications);
    this.modificationsEmitter.next(this.substance.modifications.agentModifications);
  }

  deleteSubstanceAgentModification(agentModification: AgentModification): void {
    const agentModIndex = this.substance.modifications.agentModifications.findIndex(
      agentMod => agentModification.$$deletedCode === agentMod.$$deletedCode);
    if (agentModIndex > -1) {
      this.substance.modifications.agentModifications.splice(agentModIndex, 1);
      this.modificationsEmitter.next(this.substance.modifications.agentModifications);
    }
  }
}
