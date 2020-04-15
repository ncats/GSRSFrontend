import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AgentModification, Constituent} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList} from '@gsrs-core/substance-form/base-classes/substance-form-base-filtered-list';
import { SubstanceFormConstituentsService } from './substance-form-constituents.service';

@Component({
  selector: 'app-substance-form-constituents-card',
  templateUrl: './substance-form-constituents-card.component.html',
  styleUrls: ['./substance-form-constituents-card.component.scss']
})
export class SubstanceFormConstituentsCardComponent extends SubstanceCardBaseFilteredList<Constituent>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  constituents: Array<Constituent>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormConstituentsService: SubstanceFormConstituentsService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form constituents';
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Constituents');
  }

  ngAfterViewInit() {
    const agentSubscription = this.substanceFormConstituentsService.substanceConstituents.subscribe(constituents => {
      this.constituents = constituents;
    });
    this.subscriptions.push(agentSubscription);
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addItem(): void {
    this.addConstituent();
  }

  addConstituent(): void {
    this.substanceFormConstituentsService.addSubstanceConstituent();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-constituent-0`, 'center');
    });
  }

  deleteConstituent(constituent: Constituent): void {
    this.substanceFormConstituentsService.deleteSubstanceConstituent(constituent);
  }

}
