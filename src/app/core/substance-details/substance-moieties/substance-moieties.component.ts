import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import {SubstanceDetail, SubstanceMoiety} from '../../substance/substance.model';
import { SafeUrl } from '@angular/platform-browser';
import {UtilsService} from '../../utils/utils.service';
import {Subject} from 'rxjs';
import { StructureImageModalComponent } from '@gsrs-core/structure';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-substance-moieties',
  templateUrl: './substance-moieties.component.html',
  styleUrls: ['./substance-moieties.component.scss']
})
export class SubstanceMoietiesComponent extends SubstanceCardBase implements OnInit {
  moieties: Array<SubstanceMoiety> = [];
  substanceUpdated = new Subject<SubstanceDetail>();
  private overlayContainer: HTMLElement;

  constructor(
              private utilService: UtilsService,
              private overlayContainerService: OverlayContainer,
              private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null && this.substance.moieties != null) {
        this.moieties = this.substance.moieties;
      }
      this.countUpdate.emit(this.moieties.length);
    });
    this.overlayContainer = this.overlayContainerService.getContainerElement();

  }
  openImageModal(substance) {
  const dialogRef = this.dialog.open(StructureImageModalComponent, {
    height: '90%',
    width: '650px',
    panelClass: 'structure-image-panel',
    data: {structure: substance.uuid}
  });

  this.overlayContainer.style.zIndex = '1002';

  const subscription = dialogRef.afterClosed().subscribe(() => {
    this.overlayContainer.style.zIndex = null;
    subscription.unsubscribe();
  }, () => {
    this.overlayContainer.style.zIndex = null;
    subscription.unsubscribe();
  });

}
}
