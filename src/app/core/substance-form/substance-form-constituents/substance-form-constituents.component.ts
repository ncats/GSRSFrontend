import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AgentModification, Constituent} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';

@Component({
  selector: 'app-substance-form-constituents',
  templateUrl: './substance-form-constituents.component.html',
  styleUrls: ['./substance-form-constituents.component.scss']
})
export class SubstanceFormConstituentsComponent extends SubstanceCardBaseFilteredList<Constituent>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {

  constituents: Array<Constituent>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
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
    const agentSubscription = this.substanceFormService.substanceConstituents.subscribe(constituents => {
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
    this.substanceFormService.addSubstanceConstituent();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-constituent-0`, 'center');
    });
  }

  deleteConstituent(constituent: Constituent): void {
    this.substanceFormService.deleteSubstanceConstituent(constituent);
  }

}
