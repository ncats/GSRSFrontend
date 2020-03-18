import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList, SubstanceCardBaseList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';
import {Mixture, MixtureComponents, SubstanceRelationship} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';

@Component({
  selector: 'app-substance-form-mixture-components',
  templateUrl: './substance-form-mixture-components.component.html',
  styleUrls: ['./substance-form-mixture-components.component.scss']
})
export class SubstanceFormMixtureComponentsComponent extends SubstanceCardBaseFilteredList<SubstanceRelationship>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  relationships: Array<MixtureComponents>;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private substanceFormService: SubstanceFormService,
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
    const relationshipsSubscription = this.substanceFormService.substanceMixtureComponents.subscribe(components => {
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
    this.substanceFormService.addSubstanceMixtureComponent();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-mixture-component-0`, 'center');
    });
  }

  deleteComponent(relationship: MixtureComponents): void {
    this.substanceFormService.deleteSubstanceMixtureComponent(relationship);
  }
}
