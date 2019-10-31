import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';
import {PhysicalModification} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';

@Component({
  selector: 'app-substance-form-physical-modifications',
  templateUrl: './substance-form-physical-modifications.component.html',
  styleUrls: ['./substance-form-physical-modifications.component.scss']
})
export class SubstanceFormPhysicalModificationsComponent extends SubstanceCardBaseFilteredList<PhysicalModification> implements OnInit, AfterViewInit, OnDestroy{
  modifications: Array<PhysicalModification>;
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
    this.menuLabelUpdate.emit('Physical Modifications');
  }

  ngAfterViewInit() {
    const physicalSubscription = this.substanceFormService.substancePhysicalModifications.subscribe(modifications => {
      this.modifications = modifications;
    });
    this.subscriptions.push(physicalSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addStructuralModification(): void {
    this.substanceFormService.addSubstancePhysicalModification();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-physical-modification-0`, 'center');
    });
  }

  deleteStructuralModification(modification: PhysicalModification): void {
    this.substanceFormService.deleteSubstancePhysicalModification(modification);
  }
}
