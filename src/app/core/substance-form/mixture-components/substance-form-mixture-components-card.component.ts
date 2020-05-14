import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList, SubstanceCardBaseList} from '@gsrs-core/substance-form/base-classes/substance-form-base-filtered-list';
import {MixtureComponents, SubstanceRelationship} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormMixtureComponentsService} from './substance-form-mixture-components.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';

@Component({
  selector: 'app-substance-form-mixture-components-card',
  templateUrl: './substance-form-mixture-components-card.component.html',
  styleUrls: ['./substance-form-mixture-components-card.component.scss']
})
export class SubstanceFormMixtureComponentsCardComponent extends SubstanceCardBaseFilteredList<SubstanceRelationship>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  relationships: Array<MixtureComponents>;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private substanceFormMixtureComponentsService: SubstanceFormMixtureComponentsService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Components');
    this.analyticsEventCategory = 'substance form mixture components';
  }

  ngAfterViewInit() {
    const relationshipsSubscription = this.substanceFormMixtureComponentsService.substanceMixtureComponents.subscribe(components => {
      this.relationships = components;
    });
    this.subscriptions.push(relationshipsSubscription);
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addItem(): void {
    this.addComponent();
  }

  addComponent(): void {
    this.substanceFormMixtureComponentsService.addSubstanceMixtureComponent();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-mixture-component-0`, 'center');
    });
  }

  deleteComponent(relationship: MixtureComponents): void {
    this.substanceFormMixtureComponentsService.deleteSubstanceMixtureComponent(relationship);
  }
}
