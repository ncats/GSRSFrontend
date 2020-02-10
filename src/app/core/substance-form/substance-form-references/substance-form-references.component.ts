import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '../substance-form-base-filtered-list';
import { SubstanceReference } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { MatDialog } from '@angular/material/dialog';
import { RefernceFormDialogComponent } from '../references-dialogs/refernce-form-dialog.component';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-substance-form-references',
  templateUrl: './substance-form-references.component.html',
  styleUrls: ['./substance-form-references.component.scss']
})
export class SubstanceFormReferencesComponent extends SubstanceCardBaseFilteredList<SubstanceReference>
  implements OnInit, AfterViewInit, OnDestroy {
  references: Array<SubstanceReference>;
  private subscriptions: Array<Subscription> = [];
  private overlayContainer: HTMLElement;

  constructor(
    private substanceFormService: SubstanceFormService,
    private dialog: MatDialog,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form references';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('References');
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  ngAfterViewInit() {
    const referencesSubscription = this.substanceFormService.substanceReferences.subscribe(references => {
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
      if (newReference != null) {
        this.substanceFormService.addSubstanceReference(newReference);
      }
    });
    this.subscriptions.push(dialogSubscription);
  }

  addSubstanceReference(): void {
    const addedReference = this.substanceFormService.addSubstanceReference({});
    setTimeout(() => {
      this.scrollToService.scrollToElement(addedReference.uuid, 'center');
    }, 10);
  }

  deleteReference(reference: SubstanceReference): void {
    this.substanceFormService.deleteSubstanceReference(reference);
  }

}
