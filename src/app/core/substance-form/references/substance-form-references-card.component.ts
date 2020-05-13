import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../base-classes/substance-form-base-filtered-list';
import { SubstanceReference } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { MatDialog } from '@angular/material/dialog';
import { RefernceFormDialogComponent } from './references-dialogs/refernce-form-dialog.component';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceFormReferencesService } from './substance-form-references.service';

@Component({
  selector: 'app-substance-form-references-card',
  templateUrl: './substance-form-references-card.component.html',
  styleUrls: ['./substance-form-references-card.component.scss']
})
export class SubstanceFormReferencesCardComponent extends SubstanceCardBaseFilteredList<SubstanceReference>
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

  openReferenceFormDialog(reference: SubstanceReference = { access: [] }): void {

    const dialogRef = this.dialog.open(RefernceFormDialogComponent, {
      data: reference,
      width: '900px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newReference => {
      this.overlayContainer.style.zIndex = null;
      if (newReference != null && newReference.doctype && newReference.citation) {
        this.substanceFormReferencesService.addSubstanceReference(newReference);
      }
    });
    this.subscriptions.push(dialogSubscription);
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
