import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Link, Linkage, Site} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {ControlledVocabularyService} from '@gsrs-core/controlled-vocabulary';
import {MatDialog} from '@angular/material/dialog';
import {UtilsService} from '@gsrs-core/utils';
import {OverlayContainer} from '@angular/cdk/overlay';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';

@Component({
  selector: 'app-link-form',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.scss']
})
export class LinkFormComponent implements OnInit, OnDestroy {

  privateLink: Linkage;
  @Output() linkDeleted = new EventEmitter<Linkage>();
  @Input() remaining: Array<Site>;
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
    this.updateDisplay();
    return this.privateLink;
  }

  addRemainingSites(): void {
    if(this.privateLink.sites){
      this.privateLink.sites = this.privateLink.sites.concat(this.remaining);
    } else {
      this.privateLink.sites = this.remaining;
    }
    this.updateDisplay();
    this.substanceFormService.emitLinkUpdate();
  }

  updateDisplay(): void {
    if(this.privateLink){
      this.siteDisplay = this.substanceFormService.siteString(this.privateLink.sites);

    }
  }

  deleteLink(): void {
    this.privateLink.$$deletedCode = this.utilsService.newUUID();
      this.deleteTimer = setTimeout(() => {
        this.linkDeleted.emit(this.link);
        this.substanceFormService.emitLinkUpdate();
      }, 2000);
  }


  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateLink.$$deletedCode;
  }

  getVocabularies(): void {
    const subscription = this.cvService.getDomainVocabulary('NUCLEIC_ACID_LINKAGE').subscribe(response => {
      this.linkageTypes = response['NUCLEIC_ACID_LINKAGE'].list;
    });
    this.subscriptions.push(subscription);
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(SubunitSelectorDialogComponent, {
      data: {'card': 'link', 'link': this.privateLink.sites},
      width: '1040px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newLinks => {
      this.overlayContainer.style.zIndex = null;
      if (newLinks) {
        this.privateLink.sites = newLinks;
      }
      this.updateDisplay();
      this.substanceFormService.emitLinkUpdate();
    });
    this.subscriptions.push(dialogSubscription);
  }

}
