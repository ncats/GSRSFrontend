import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList, SubstanceCardBaseList} from '@gsrs-core/substance-form/base-classes/substance-form-base-filtered-list';
import {PhysicalModification} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import { SubstanceFormPhysicalModificationsService } from './substance-form-physical-modifications.service';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PhysicalModificationFormComponent } from './physical-modification-form.component';
import { ScrollToTargetDirective } from '@gsrs-core/scroll-to/scroll-to-target.directive';

@Component({
    selector: 'app-substance-form-physical-modifications-card',
    templateUrl: './substance-form-physical-modifications-card.component.html',
    styleUrls: ['./substance-form-physical-modifications-card.component.scss'],
    standalone: true,
    imports: [CommonModule, MatDividerModule, MatIconModule, MatButtonModule, PhysicalModificationFormComponent, ScrollToTargetDirective],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubstanceFormPhysicalModificationsCardComponent extends SubstanceCardBaseFilteredList<PhysicalModification>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  modifications: Array<PhysicalModification>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormPhysicalModificationsService: SubstanceFormPhysicalModificationsService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    cdr: ChangeDetectorRef
  ) {
    super(gaService, cdr);
    this.analyticsEventCategory = 'substance form agent modifications';
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Physical Modifications');
  }

  ngAfterViewInit() {
    const physicalSubscription = this.substanceFormPhysicalModificationsService.substancePhysicalModifications.subscribe(modifications => {
      this.modifications = modifications;
      this.cdr?.markForCheck();
    });
    this.subscriptions.push(physicalSubscription);
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
    this.substanceFormPhysicalModificationsService.addSubstancePhysicalModification();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-physical-modification-0`, 'center');
    });
  }

  deletePhysicalModification(modification: PhysicalModification): void {
    this.substanceFormPhysicalModificationsService.deleteSubstancePhysicalModification(modification);
  }
}
