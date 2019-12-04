import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';
import {AgentModification, StructuralModification} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';

@Component({
  selector: 'app-substance-form-agent-modifications',
  templateUrl: './substance-form-agent-modifications.component.html',
  styleUrls: ['./substance-form-agent-modifications.component.scss']
})
// tslint:disable-next-line:max-line-length
export class SubstanceFormAgentModificationsComponent extends SubstanceCardBaseFilteredList<AgentModification> implements OnInit, AfterViewInit, OnDestroy{
  modifications: Array<AgentModification>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
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
    const agentSubscription = this.substanceFormService.substanceAgentModifications.subscribe(modifications => {
      this.modifications = modifications;
    });
    this.subscriptions.push(agentSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addStructuralModification(): void {
    this.substanceFormService.addSubstanceAgentModification();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-agent-modification-0`, 'center');
    });
  }

  deleteAgentModification(modification: AgentModification): void {
    this.substanceFormService.deleteSubstanceAgentModification(modification);
  }
}
