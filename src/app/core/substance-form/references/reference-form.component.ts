import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SubstanceReference } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { ConfigService } from '../../config/config.service'
import { UtilsService } from '../../utils/utils.service';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceFormReferencesService } from './substance-form-references.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { PreviousReferencesDialogComponent } from '@gsrs-core/substance-form/references/previous-references/previous-references-dialog/previous-references-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reference-form',
  templateUrl: './reference-form.component.html',
  styleUrls: ['./reference-form.component.scss']
})
export class ReferenceFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() reference: SubstanceReference;
  @Output() referenceDeleted = new EventEmitter<SubstanceReference>();
  @Input() hideDelete = false;
  private overlayContainer: HTMLElement;
  deleteTimer: any;
  disableReferenceDocumentUpload = false;
  showPrev = false;
  loading = false;
  error = false;
  citationMapping: any;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private cvService: ControlledVocabularyService,
    private configService: ConfigService,
    private utilsService: UtilsService,
    private substanceFormReferencesService: SubstanceFormReferencesService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
    private substanceFormService: SubstanceFormService
  ) { }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.disableReferenceDocumentUpload = this.configService.configData.disableReferenceDocumentUpload;
    if (this.configService.configData && this.configService.configData.citationMapping) {
      //This config object is meant to map certain source type values with an automatically filled out citation value on selection.
      this.citationMapping = this.configService.configData.citationMapping;
    }
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

  openPreviousDialog(): void {
      const dialogRef = this.dialog.open(PreviousReferencesDialogComponent, {
        data: {},
        width: '990px'
      });
      this.overlayContainer.style.zIndex = '1002';
      const dialogSubscription = dialogRef.afterClosed().subscribe(ref => {
        this.overlayContainer.style.zIndex = null;
       if (ref) {
         if (ref.citation && ref.citation !== '' && ref.docType && ref.docType !== '') {
          this.fillReference(ref);
        }
       }
      });
      this.subscriptions.push(dialogSubscription);
    }

    fillReference(ref: SubstanceReference) {
      this.showPrev = false;
      this.reference.access = ref.access;
      this.reference.citation = ref.citation;
      this.reference.deprecated = ref.deprecated;
      this.reference.docType = ref.docType;
      this.reference.publicDomain = ref.publicDomain;
      this.reference.tags = ref.tags;
      this.reference.uploadedFile = ref.uploadedFile;
      this.reference.url = ref.url || null;
      this.reference.id = ref.id || null;
    }

  downloadDocument(url: string): void {
    this.substanceFormService.bypassUpdateCheck();
    window.open(url);
  }

  setSourceType(event: any): void {
    if (event) {
      this.reference.docType = event;
    }
    if (this.citationMapping && this.citationMapping[this.reference.docType]) {
      this.reference.citation = this.citationMapping[this.reference.docType];
    }

  }

  updatePublicDomain() {
    if(this.reference && this.reference.publicDomain) {
      this.reference.publicDomain = !this.reference.publicDomain;
    } else {
      this.reference.publicDomain = true;
    }
  }

}
