import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList, SubstanceCardBaseList} from '@gsrs-core/substance-form/base-classes/substance-form-base-filtered-list';
import {PhysicalModification, StructuralModification} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import { SubstanceFormStructuralModificationsService } from './substance-form-structural-modifications.service';

@Component({
  selector: 'app-substance-form-structural-modifications-card',
  templateUrl: './substance-form-structural-modifications-card.component.html',
  styleUrls: ['./substance-form-structural-modifications-card.component.scss']
})
export class SubstanceFormStructuralModificationsCardComponent extends SubstanceCardBaseFilteredList<StructuralModification>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  modifications: Array<StructuralModification>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormStructuralModificationsService: SubstanceFormStructuralModificationsService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form structural modifications';
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Structural Modifications');
  }

  ngAfterViewInit() {
    const structuralSubscription = this.substanceFormStructuralModificationsService
      .substanceStructuralModifications
      .subscribe(modifications => {

      this.modifications = modifications;
    });
    this.subscriptions.push(structuralSubscription);
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addItem(): void {
    this.addStructuralModification();
  }

  addStructuralModification(): void {
    this.substanceFormStructuralModificationsService.addSubstanceStructuralModification();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-structural-modification-0`, 'center');
    });
  }

  deleteStructuralModification(modification: StructuralModification): void {
    this.substanceFormStructuralModificationsService.deleteSubstanceStructuralModification(modification);
  }

}
