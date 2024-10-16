import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SubstanceReference } from '@gsrs-core/substance';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { UtilsService } from '@gsrs-core/utils';
import { SubstanceFormService } from '../substance-form.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { PreviousReferencesDialogComponent } from '@gsrs-core/substance-form/references/previous-references/previous-references-dialog/previous-references-dialog.component';
import { Subscription } from 'rxjs';
import {SubstanceFormReferencesService} from "@gsrs-core/substance-form/references/substance-form-references.service";

@Component({
  selector: 'app-simplified-reference-form',
  templateUrl: './simplified-reference-form.component.html',
  styleUrls: ['./simplified-reference-form.component.scss']
})
export class SimplifiedReferenceFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() reference: SubstanceReference;
  @Output() referenceDeleted = new EventEmitter<SubstanceReference>();
  @Input() hideDelete = false;
  private overlayContainer: HTMLElement;
  deleteTimer: any;
  showPrev = false;
  loading = false;
  error = false;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private utilsService: UtilsService,
    private substanceFormReferencesService: SubstanceFormReferencesService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
    private substanceFormService: SubstanceFormService
  ) { }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();

    // Private domain by default.
    this.reference.publicDomain = false;

    // Protected access by default.
    this.reference.access = ["protected"]
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  updateAccess(access: Array<string>): void {
    this.reference.access = access;
  }

  setSourceType(event?: any): void {
    if (event) {
      this.reference.docType = event;
    }
  }

  updateTags(tags: Array<string>): void {
    this.reference.tags = tags;
  }

  get isValid(): boolean {
    if (this.reference.docType
      && this.reference.citation) {
        return true;
    } else {
      return false;
    }
  }

  deleteReference(): void {
    this.reference.$$deletedCode = this.utilsService.newUUID();
    if (!this.reference.docType
      && !this.reference.citation
      && !this.reference.uploadedFile
    ) {
      this.deleteTimer = setTimeout(() => {
        this.referenceDeleted.emit(this.reference);
      }, 2000);
    } else {
      this.substanceFormReferencesService.emitReferencesUpdate();
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.reference.$$deletedCode;
    this.substanceFormReferencesService.emitReferencesUpdate();
  }

  fileSelected(file: File): void {
    this.error = false;
    if (file != null) {
      this.loading = true;
      this.utilsService.uploadFile(file).subscribe(response => {
        this.reference.uploadedFile = response;
        this.loading = false;

      }, error => {
        this.loading = false;
        this.error = true;

      });
    }
  }
}
