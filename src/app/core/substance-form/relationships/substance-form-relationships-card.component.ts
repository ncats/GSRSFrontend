import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../base-classes/substance-form-base-filtered-list';
import { SubstanceRelationship } from '@gsrs-core/substance/substance.model';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';
import { SubstanceFormRelationshipsService } from './substance-form-relationships.service';
import { ConfigService } from '@gsrs-core/config';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { RelationshipFormComponent } from './relationship-form.component';
import { ScrollToTargetDirective } from '@gsrs-core/scroll-to/scroll-to-target.directive';

@Component({
    selector: 'app-substance-form-relationships-card',
    templateUrl: './substance-form-relationships-card.component.html',
    styleUrls: ['./substance-form-relationships-card.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatPaginatorModule, MatInputModule, RelationshipFormComponent, ScrollToTargetDirective],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SubstanceFormRelationshipsCardComponent extends SubstanceCardBaseFilteredList<SubstanceRelationship>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  relationships: Array<SubstanceRelationship>;
  private subscriptions: Array<Subscription> = [];
  expanded = true;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];


  constructor(
    private substanceFormRelationshipsService: SubstanceFormRelationshipsService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    private configService: ConfigService,
    cdr: ChangeDetectorRef,

  ) {
    super(gaService, cdr);
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Relationships');
    this.analyticsEventCategory = 'substance form relationships';

    if (this.configService && this.configService.configData && this.configService.configData.editPagingOptionSettings && this.configService.configData.editPagingOptionSettings.relationships ){
          let pagingSettings = this.configService.configData.editPagingOptionSettings.relationships;
          if(pagingSettings.pageSizeDefault) {
            this.pageSize = pagingSettings.pageSizeDefault
          }
          if(pagingSettings.pageSizeOptions) {
            this.pageSizeOptions = pagingSettings.pageSizeOptions;
          }
    }
  }

  ngAfterViewInit() {
    const relationshipsSubscription = this.substanceFormRelationshipsService.substanceRelationships.subscribe(relationships => {
      this.relationships = relationships;
      this.filtered = relationships;
      const searchSubscription = this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.relationships, this.analyticsEventCategory);
      }, error => {
      });
      this.subscriptions.push(searchSubscription);
      this.page = 0;
      this.pageChange();
      this.cdr?.markForCheck();
    });
    this.subscriptions.push(relationshipsSubscription);
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  collapse() {
    this.expanded = !this.expanded;
  }

  addItem(): void {
    this.addRelationship();
  }

  addRelationship(): void {
    this.substanceFormRelationshipsService.addSubstanceRelationship();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-relationship-0`, 'center');
    });
  }

  deleteRelationship(relationship: SubstanceRelationship): void {
    this.substanceFormRelationshipsService.deleteSubstanceRelationship(relationship);
  }

}
