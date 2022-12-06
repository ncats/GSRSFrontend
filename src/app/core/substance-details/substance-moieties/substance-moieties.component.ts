import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import {SubstanceDetail, SubstanceMoiety} from '../../substance/substance.model';
import { SafeUrl } from '@angular/platform-browser';
import {UtilsService} from '../../utils/utils.service';
import {Subject} from 'rxjs';
import { StructureImageModalComponent, StructureService } from '@gsrs-core/structure';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '@gsrs-core/config';

@Component({
  selector: 'app-substance-moieties',
  templateUrl: './substance-moieties.component.html',
  styleUrls: ['./substance-moieties.component.scss']
})
export class SubstanceMoietiesComponent extends SubstanceCardBase implements OnInit {
  moieties: Array<SubstanceMoiety> = [];
  substanceUpdated = new Subject<SubstanceDetail>();
  private overlayContainer: HTMLElement;
  rounding = '1.0-2';

  constructor(
              private utilService: UtilsService,
              private overlayContainerService: OverlayContainer,
              private structureService: StructureService,
              private dialog: MatDialog,
              private configService: ConfigService
  ) {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null && this.substance.moieties != null) {
        this.moieties = JSON.parse(JSON.stringify(this.substance.moieties));
        this.moieties.forEach( unit => {
          unit.formula = this.structureService.formatFormula(unit);

        });
      }
      this.countUpdate.emit(this.moieties.length);
    });
    this.overlayContainer = this.overlayContainerService.getContainerElement();

    if (this.configService.configData && this.configService.configData.molWeightRounding) {
      this.rounding = '1.0-' + this.configService.configData.molWeightRounding;
  }

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
