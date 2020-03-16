import { Component, OnInit, Input, ElementRef, OnDestroy } from '@angular/core';
import { SubstanceReference } from '../../substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { MatDialog } from '@angular/material/dialog';
import { RefernceFormDialogComponent } from '../references-dialogs/refernce-form-dialog.component';
import { ReuseReferencesDialogComponent } from '../references-dialogs/reuse-references-dialog.component';
import { ReuseReferencesDialogData } from '../references-dialogs/reuse-references-dialog-data.model';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from '../../utils/utils.service';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-domain-references',
  templateUrl: './domain-references.component.html',
  styleUrls: ['./domain-references.component.scss']
})
export class DomainReferencesComponent implements OnInit, OnDestroy {
  @Input() card?: string;
  private domainReferenceUuids: Array<string>;
  private substanceReferences: Array<SubstanceReference>;
  canReuse = false;
  references: Array<SubstanceReference> = [];
  documentTypesDictionary: { [dictionaryValue: string]: VocabularyTerm } = {};
  displayedColumns: string[] = ['type', 'citation', 'publicDomain', 'access', 'goToReference', 'remove', 'attachment', 'delete', 'apply'];
  tableData: MatTableDataSource<SubstanceReference>;
  isExpanded = false;
  private subscriptions: Array<Subscription> = [];
  private overlayContainer: HTMLElement;

  constructor(
    private cvService: ControlledVocabularyService,
    private substanceFormService: SubstanceFormService,
    private dialog: MatDialog,
    private element: ElementRef,
    private utilsService: UtilsService,
    private overlayContainerService: OverlayContainer
  ) { }

  ngOnInit() {
    this.getVocabularies();
    const referencesSubscription = this.substanceFormService.substanceReferences.subscribe(references => {
      if (references && references.length) {
        this.substanceReferences = references.filter(reference => !reference.$$deletedCode);
      } else {
        this.substanceReferences = [];
      }
      this.canReuse = this.substanceReferences && this.substanceReferences.length > 0;
      this.loadReferences();
    });
    this.subscriptions.push(referencesSubscription);
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  @Input()
  set referencesUuids(referencesUuids: Array<string>) {
    this.domainReferenceUuids = referencesUuids || [];
    this.loadReferences();
  }

  get referencesUuids(): Array<string> {
    return this.domainReferenceUuids;
  }

  getVocabularies(): void {
    const dictionarySubscription = this.cvService.getDomainVocabulary('DOCUMENT_TYPE').subscribe(response => {
      this.documentTypesDictionary = response['DOCUMENT_TYPE'].dictionary;
    });
    this.subscriptions.push(dictionarySubscription);
  }

  private loadReferences() {
    if (this.domainReferenceUuids && this.substanceReferences) {
      this.references = [];
      this.domainReferenceUuids.forEach((uuid: string) => {
        const substanceReference = this.substanceReferences.find(reference => reference.uuid === uuid);
        if (substanceReference != null) {
          this.references.push(substanceReference);
        }
      });
      this.tableData = new MatTableDataSource<SubstanceReference>(this.references);
    } else {
      this.references = [];
    }
  }

  addNewReference(): void {

    const reference: SubstanceReference = {
      tags: [],
      access: []
    };

    const dialogRef = this.dialog.open(RefernceFormDialogComponent, {
      data: reference,
      width: '900px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newReference => {
      this.overlayContainer.style.zIndex = null;
      if (newReference != null) {
        newReference = this.substanceFormService.addSubstanceReference(newReference);
        setTimeout(() => {
          this.addDomainReference(newReference.uuid);
        });
        this.canReuse = true;
      }
    });
    this.subscriptions.push(dialogSubscription);
  }

  openExistingReferenceForm(reference: SubstanceReference): void {

    const dialogRef = this.dialog.open(RefernceFormDialogComponent, {
      data: reference,
      width: '900px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(updatedReference => {
      this.overlayContainer.style.zIndex = null;
    });
    this.subscriptions.push(dialogSubscription);
  }

  addDomainReference(uuid: string): void {
    if (this.domainReferenceUuids.indexOf(uuid) === -1) {
      this.domainReferenceUuids.push(uuid);
    }

    let substanceReference = this.references.find(reference => reference.uuid === uuid);
    if (substanceReference == null) {
      substanceReference = this.substanceReferences.find(reference => reference.uuid === uuid);
      if (substanceReference != null) {
        this.references.unshift(substanceReference);
        this.tableData.data = this.references;
      }
    }
  }

  reuseExistingReference(): void {

    const data: ReuseReferencesDialogData = {
      domainRefereceUuids: this.domainReferenceUuids,
      substanceReferences: this.substanceReferences
    };

    const dialogRef = this.dialog.open(ReuseReferencesDialogComponent, {
      data: data,
      width: '900px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(domainRefereceUuids => {
      this.overlayContainer.style.zIndex = null;
      if (domainRefereceUuids != null) {
        this.updateDomainReferences(domainRefereceUuids);
      }
    });
    this.subscriptions.push(dialogSubscription);
  }

  updateDomainReferences(referenceUuids: Array<string> = []): void {
    this.domainReferenceUuids.length = 0;
    referenceUuids.forEach(uuid => {
        this.domainReferenceUuids.push(uuid);
    });
    const references = [];
    this.domainReferenceUuids.forEach((uuid: string) => {
      const substanceReference = this.substanceReferences.find(reference => reference.uuid === uuid);
      if (substanceReference != null) {
        references.push(substanceReference);
      }
    });
    this.references = references;
    this.tableData.data = this.references;
  }

  removeDomainReference(uuid: string): void {
    const referenceUuidIndex = this.domainReferenceUuids.indexOf(uuid);

    if (referenceUuidIndex > -1) {
      this.domainReferenceUuids.splice(referenceUuidIndex, 1);
    }
    const substanceReferenceIndex = this.references.findIndex(reference => reference.uuid === uuid);

    if (substanceReferenceIndex > -1) {
      this.references.splice(substanceReferenceIndex, 1);
    }
    this.tableData.data = this.references;
  }

  deleteReference(reference: SubstanceReference): void {
    reference.$$deletedCode = this.utilsService.newUUID();
    this.substanceFormService.emitReferencesUpdate();
  }

  panelOpened(): void {
    this.isExpanded = true;
    const event: Event = new Event('focusin', { bubbles: true, cancelable: true });
    this.element.nativeElement.dispatchEvent(event);
  }

  panelClosed(): void {
    this.isExpanded = false;
    const event: Event = new Event('focusout', { bubbles: true, cancelable: true });
    this.element.nativeElement.dispatchEvent(event);
  }

}
