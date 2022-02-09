import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {SubstanceAmount, SubstanceDetail, SubstanceProperty} from '../../substance/substance.model';
import {Subject} from 'rxjs';
import { UtilsService } from '@gsrs-core/utils';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-substance-properties',
  templateUrl: './substance-properties.component.html',
  styleUrls: ['./substance-properties.component.scss']
})
export class SubstancePropertiesComponent extends SubstanceCardBase implements OnInit {
  properties: Array<SubstanceProperty> = [];
  displayedColumns: string[] = ['name', 'property type', 'amount', 'referenced substance', 'defining', 'parameters', 'references'];
  substanceUpdated = new Subject<SubstanceDetail>();
  private overlayContainer: HTMLElement;
  constructor(
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
  ) {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null && this.substance.properties != null) {
        this.properties = this.substance.properties;
      }
      this.countUpdate.emit(this.properties.length);
    });
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  public toString(amount: SubstanceAmount) {
    return this.utilsService.displayAmount(amount);
  }

  openModal(templateRef) {

    const dialogRef = this.dialog.open(templateRef, {
      minWidth: '40%',
      maxWidth: '90%'
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }

}
