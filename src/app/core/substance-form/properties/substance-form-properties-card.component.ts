import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../base-classes/substance-form-base-filtered-list';
import { SubstanceProperty } from '@gsrs-core/substance/substance.model';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';
import { SubstanceFormPropertiesService } from './substance-form-properties.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { PropertyFormComponent } from './property-form.component';
import { ScrollToTargetDirective } from '@gsrs-core/scroll-to/scroll-to-target.directive';

@Component({
    selector: 'app-substance-form-properties-card',
    templateUrl: './substance-form-properties-card.component.html',
    styleUrls: ['./substance-form-properties-card.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatInputModule, PropertyFormComponent, ScrollToTargetDirective],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubstanceFormPropertiesCardComponent extends SubstanceCardBaseFilteredList<SubstanceProperty>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  properties: Array<SubstanceProperty>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormPropertiesService: SubstanceFormPropertiesService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    cdr: ChangeDetectorRef
  ) {
    super(gaService, cdr);
    this.analyticsEventCategory = 'substance form properties';
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Properties');
  }

  ngAfterViewInit() {
    const propertiesSubscription = this.substanceFormPropertiesService.substanceProperties.subscribe(properties => {
      this.properties = properties;
      this.filtered = properties;
      const searchSubscription = this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.properties, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.subscriptions.push(searchSubscription);
      this.page = 0;
      this.pageChange();
      this.cdr?.markForCheck();
    });
    this.subscriptions.push(propertiesSubscription);
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addItem(): void {
    this.addProperty();
  }

  addProperty(): void {
    this.substanceFormPropertiesService.addSubstanceProperty();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-property-0`, 'center');
    });
  }

  deleteProperty(property: SubstanceProperty): void {
    this.substanceFormPropertiesService.deleteSubstanceProperty(property);
  }

}
