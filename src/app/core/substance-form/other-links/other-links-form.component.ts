import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
// not sure about isPairedLinkageType
import {isPairedLinkageType, Link, SubstanceReference} from '@gsrs-core/substance';
import {UtilsService} from '@gsrs-core/utils';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {MatDialog} from '@angular/material/dialog';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';
import {SubunitSelectorComponent} from '@gsrs-core/substance-form/subunit-selector/subunit-selector.component';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AuditInfoComponent} from '@gsrs-core/substance-form/audit-info/audit-info.component';
import {CvInputComponent} from '@gsrs-core/substance-form/cv-input/cv-input.component';

@Component({
    selector: 'app-other-links-form',
    templateUrl: './other-links-form.component.html',
    styleUrls: ['./other-links-form.component.scss'],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, AuditInfoComponent, CvInputComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtherLinksFormComponent implements OnInit, OnDestroy {

  private privateLink: Link;
  @Output() linkDeleted = new EventEmitter<Link>();
  deleteTimer: any;
  linkageTypes: any;
  private subscriptions: Array<Subscription> = [];
  private overlayContainer: HTMLElement;
  siteDisplay: string;

  constructor(
  private cvService: ControlledVocabularyService,
  private dialog: MatDialog,
  private utilsService: UtilsService,
  private overlayContainerService: OverlayContainer,
  private substanceFormService: SubstanceFormService,
  private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getVocabularies();
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.updateDisplay();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  @Input()
  set link(link: Link) {
    this.privateLink = link;
  }

  get link(): Link {
    return this.privateLink;
  }

// __aw__sb41ang21 ang21 not sure
//  updateDisplay(): void {
//    this.siteDisplay = this.substanceFormService.siteString(this.privateLink.sites);
//  }


// __aw__sb41ang21 springBoot41 not sure
  updateDisplay(): void {
    // Paired-linkage types (e.g. Cys-linker-Cys) use pairedSiteString(), which keeps site pairing instead of sorting/range-compressing like siteString().
    if (isPairedLinkageType(this.privateLink.linkageType)) {
      this.siteDisplay = this.substanceFormService.pairedSiteString(this.privateLink.sites);
    } else {
      this.siteDisplay = this.substanceFormService.siteString(this.privateLink.sites);
    }
  }



// __aw__sb41ang21 springBoot41 not sure
  onLinkageTypeChange(value: string): void {
    this.privateLink.linkageType = value;
    // Re-render siteDisplay since the paired-vs-flat format depends on the type.
    this.updateDisplay();
  }

  deleteLink(): void {
    this.privateLink.$$deletedCode = this.utilsService.newUUID();
      this.deleteTimer = setTimeout(() => {
        this.linkDeleted.emit(this.link);
        this.substanceFormService.emitOtherLinkUpdate();
      }, 2000);
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateLink.$$deletedCode;
  }

  getVocabularies(): void {
    const subscription = this.cvService.getDomainVocabulary('OTHER_LINKAGE_TYPE').subscribe(response => {
      this.linkageTypes = response['OTHER_LINKAGE_TYPE'].list;
      this.cdr.markForCheck();
    });
    this.subscriptions.push(subscription);
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(SubunitSelectorDialogComponent, {
// __aw__sb41ang21 ang21 not sure
//      data: {'card': 'other', 'link': this.privateLink.sites},

// __aw__sb41ang21 springBoot41 not sure
      // preserveSiteOrder stops the selector from re-sorting sites after each click, which would lose pairing before the dialog closes.
      data: {'card': 'other', 'link': this.privateLink.sites, 'preserveSiteOrder': isPairedLinkageType(this.privateLink.linkageType)},

      width: '1040px',
      panelClass: 'subunit-dialog'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newLinks => {
      this.overlayContainer.style.zIndex = null;
      if (newLinks) {
        this.privateLink.sites = newLinks;
        this.substanceFormService.emitOtherLinkUpdate();
      }
      this.updateDisplay();
      this.cdr.markForCheck();
    });
    const dialogSubscription2 = dialogRef.backdropClick().subscribe(sub => {     }
    );

    dialogSubscription2.unsubscribe();
    this.subscriptions.push(dialogSubscription);
  }


}
