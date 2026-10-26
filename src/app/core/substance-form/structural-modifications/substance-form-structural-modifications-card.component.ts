import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList, SubstanceCardBaseList} from '@gsrs-core/substance-form/base-classes/substance-form-base-filtered-list';
import {PhysicalModification, StructuralModification} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import { SubstanceFormStructuralModificationsService } from './substance-form-structural-modifications.service';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StructuralModificationFormComponent } from './structural-modification-form.component';
import { ScrollToTargetDirective } from '@gsrs-core/scroll-to/scroll-to-target.directive';

@Component({
    selector: 'app-substance-form-structural-modifications-card',
    templateUrl: './substance-form-structural-modifications-card.component.html',
    styleUrls: ['./substance-form-structural-modifications-card.component.scss'],
    standalone: true,
    imports: [CommonModule, MatDividerModule, MatIconModule, MatButtonModule, StructuralModificationFormComponent, ScrollToTargetDirective],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubstanceFormStructuralModificationsCardComponent extends SubstanceCardBaseFilteredList<StructuralModification>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  modifications: Array<StructuralModification>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormStructuralModificationsService: SubstanceFormStructuralModificationsService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    cdr: ChangeDetectorRef
  ) {
    super(gaService, cdr);
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
      this.cdr?.markForCheck();
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
