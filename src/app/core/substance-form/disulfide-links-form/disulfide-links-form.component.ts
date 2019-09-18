import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Link} from '@gsrs-core/substance';
import {UtilsService} from '@gsrs-core/utils';
import {ControlledVocabularyService} from '@gsrs-core/controlled-vocabulary';
import {MatDialog} from '@angular/material/dialog';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-disulfide-links-form',
  templateUrl: './disulfide-links-form.component.html',
  styleUrls: ['./disulfide-links-form.component.scss']
})
export class DisulfideLinksFormComponent implements OnInit {

  private privateLink: Link;
  @Output() linkDeleted = new EventEmitter<Link>();
  deleteTimer: any;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private overlayContainerService: OverlayContainer
  ) { }

  ngOnInit() {
  }

  @Input()
  set link(link: Link) {
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
      }, 2000);
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateLink.$$deletedCode;
  }

  updateAccess(access: Array<string>): void {
    this.link.access = access;
  }

}
