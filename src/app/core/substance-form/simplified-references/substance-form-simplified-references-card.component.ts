import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../base-classes/substance-form-base-filtered-list';
import { SubstanceReference } from '@gsrs-core/substance/substance.model';
import { MatDialog } from '@angular/material/dialog';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import {SubstanceFormReferencesService} from "@gsrs-core/substance-form/references/substance-form-references.service";

@Component({
  selector: 'app-substance-form-references-card',
  templateUrl: './substance-form-simplified-references-card.component.html',
  styleUrls: ['./substance-form-simplified-references-card.component.scss']
})
export class SubstanceFormSimplifiedReferencesCardComponent extends SubstanceCardBaseFilteredList<SubstanceReference>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  references: Array<SubstanceReference>;
  private subscriptions: Array<Subscription> = [];
  private overlayContainer: HTMLElement;

  constructor(
    private substanceFormReferencesService: SubstanceFormReferencesService,
    private dialog: MatDialog,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form references';
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('References');
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  ngAfterViewInit() {
    const referencesSubscription = this.substanceFormReferencesService.substanceReferences.subscribe(references => {
      this.references = references;
      this.filtered = references;
      const searchSubscription = this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.references, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.subscriptions.push(searchSubscription);
      this.page = 0;
      this.pageChange();
    });
    this.subscriptions.push(referencesSubscription);
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
  addItem(): void {
    this.addSubstanceReference();
  }

  addSubstanceReference(): void {
    const addedReference = this.substanceFormReferencesService.addSubstanceReference({});
    setTimeout(() => {
      this.scrollToService.scrollToElement(addedReference.uuid, 'center');
    }, 10);
  }

  deleteReference(reference: SubstanceReference): void {
    this.substanceFormReferencesService.deleteSubstanceReference(reference);
  }

}
