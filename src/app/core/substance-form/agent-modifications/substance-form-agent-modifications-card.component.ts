import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList, SubstanceCardBaseList} from '@gsrs-core/substance-form/base-classes/substance-form-base-filtered-list';
import {AgentModification, StructuralModification} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormAgentModificationsService} from './substance-form-agent-modifications.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';

@Component({
  selector: 'app-substance-form-agent-modifications-card',
  templateUrl: './substance-form-agent-modifications-card.component.html',
  styleUrls: ['./substance-form-agent-modifications-card.component.scss']
})
// eslint-disable-next-line max-len
export class SubstanceFormAgentModificationsCardComponent
  extends SubstanceCardBaseFilteredList<AgentModification>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {

  modifications: Array<AgentModification>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormAgentModificationsService: SubstanceFormAgentModificationsService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form agent modifications';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Agent Modifications');
  }

  ngAfterViewInit() {
    this.canAddItemUpdate.emit(true);
    const agentSubscription = this.substanceFormAgentModificationsService.substanceAgentModifications.subscribe(modifications => {
      this.modifications = modifications;
    });
    this.subscriptions.push(agentSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.componentDestroyed.emit();
  }

  addItem() {
    this.addStructuralModification();
  }

  addStructuralModification(): void {
    this.substanceFormAgentModificationsService.addSubstanceAgentModification();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-agent-modification-0`, 'center');
    });
  }

  deleteAgentModification(modification: AgentModification): void {
    this.substanceFormAgentModificationsService.deleteSubstanceAgentModification(modification);
  }
}
