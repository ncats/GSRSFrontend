import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Link, SubstanceReference} from '@gsrs-core/substance';
import {UtilsService} from '@gsrs-core/utils';
import {ControlledVocabularyService} from '@gsrs-core/controlled-vocabulary';
import {MatDialog} from '@angular/material/dialog';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';
import {RefernceFormDialogComponent} from '@gsrs-core/substance-form/references-dialogs/refernce-form-dialog.component';
import {SubstanceSelectorComponent} from '@gsrs-core/substance-selector/substance-selector.component';

@Component({
  selector: 'app-other-links-form',
  templateUrl: './other-links-form.component.html',
  styleUrls: ['./other-links-form.component.scss']
})
export class OtherLinksFormComponent implements OnInit {

  private privateLink: Link;
  @Output() linkDeleted = new EventEmitter<Link>();
  deleteTimer: any;
  linkageTypes: any;
  private subscriptions: Array<Subscription> = [];

  private overlayContainer: HTMLElement;

  constructor(
  private cvService: ControlledVocabularyService,
  private dialog: MatDialog,
  private utilsService: UtilsService,
  private overlayContainerService: OverlayContainer
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  @Input()
  set link(link: Link) {
    console.log(link);
    this.privateLink = link;
  }

  get link(): Link {
    return this.privateLink;
  }

  deleteLink(): void {
    this.privateLink.$$deletedCode = this.utilsService.newUUID();
    if (!this.privateLink
    ) {
      this.deleteTimer = setTimeout(() => {
        this.linkDeleted.emit(this.link);
      }, 20);
    }
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

  openModal(): void {

    const dialogRef = this.dialog.open(SubstanceSelectorComponent, {
      width: '900px'
    });
    this.overlayContainer.style.zIndex = '1002';
  }

}
