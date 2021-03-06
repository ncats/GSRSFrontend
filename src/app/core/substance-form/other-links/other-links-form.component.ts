import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Link, SubstanceReference} from '@gsrs-core/substance';
import {UtilsService} from '@gsrs-core/utils';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {MatDialog} from '@angular/material/dialog';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';
import {SubunitSelectorComponent} from '@gsrs-core/substance-form/subunit-selector/subunit-selector.component';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';

@Component({
  selector: 'app-other-links-form',
  templateUrl: './other-links-form.component.html',
  styleUrls: ['./other-links-form.component.scss']
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
  private substanceFormService: SubstanceFormService
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
  updateDisplay(): void {
    this.siteDisplay = this.substanceFormService.siteString(this.privateLink.sites);
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
    });
    this.subscriptions.push(subscription);
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(SubunitSelectorDialogComponent, {
      data: {'card': 'other', 'link': this.privateLink.sites},
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
    });
    const dialogSubscription2 = dialogRef.backdropClick().subscribe(sub => {     }
    );

    dialogSubscription2.unsubscribe();
    this.subscriptions.push(dialogSubscription);
  }


}
