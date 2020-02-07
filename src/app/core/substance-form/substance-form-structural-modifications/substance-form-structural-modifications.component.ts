import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';
import {PhysicalModification, StructuralModification} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';

@Component({
  selector: 'app-substance-form-structural-modifications',
  templateUrl: './substance-form-structural-modifications.component.html',
  styleUrls: ['./substance-form-structural-modifications.component.scss']
})
export class SubstanceFormStructuralModificationsComponent extends SubstanceCardBaseFilteredList<StructuralModification>
  implements OnInit, AfterViewInit, OnDestroy {
  modifications: Array<StructuralModification>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form structural modifications';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Structural Modifications');
  }

  ngAfterViewInit() {
    const structuralSubscription = this.substanceFormService.substanceStructuralModifications.subscribe(modifications => {
      this.modifications = modifications;
    });
    this.subscriptions.push(structuralSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addStructuralModification(): void {
    this.substanceFormService.addSubstanceStructuralModification();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-structural-modification-0`, 'center');
    });
  }

  deleteStructuralModification(modification: StructuralModification): void {
    this.substanceFormService.deleteSubstanceStructuralModification(modification);
  }

}
