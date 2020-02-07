import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AmountFormDialogComponent} from '@gsrs-core/substance-form/amount-form-dialog/amount-form-dialog.component';
import {Subscription} from 'rxjs';
import {ControlledVocabularyService} from '@gsrs-core/controlled-vocabulary';
import {MatDialog} from '@angular/material/dialog';
import {UtilsService} from '@gsrs-core/utils';
import {OverlayContainer} from '@angular/cdk/overlay';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {StructuralUnit, SubstanceCode, SubstanceService} from '@gsrs-core/substance';
import {SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-structural-unit-form',
  templateUrl: './structural-unit-form.component.html',
  styleUrls: ['./structural-unit-form.component.scss']
})
export class StructuralUnitFormComponent implements OnInit {
  @Input() unit: StructuralUnit;
  @Output() unitDeleted  = new EventEmitter<StructuralUnit>();
  private subscriptions: Array<Subscription> = [];
  private overlayContainer: HTMLElement;
  siteDisplay: string;
  substanceType: string;
  errors = [];

  constructor(
    private cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private substanceService: SubstanceService,
    private overlayContainerService: OverlayContainer,
    private substanceFormService: SubstanceFormService
  ) { }


  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  openAmountDialog(): void {

    if (!this.unit.amount) {
      this.unit.amount = {};
      if (this.unit.type === 'SRU-BLOCK') {
        this.unit.amount = {
          type: 'DEGREE OF POLYMERIZATION',
          units: 'per polymer'};
      }
    }
    const dialogRef = this.dialog.open(AmountFormDialogComponent, {
      data: {'subsAmount': this.unit.amount},
      width: '1040px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newAmount => {
      this.overlayContainer.style.zIndex = null;
      this.unit.amount = newAmount;

    });
    this.subscriptions.push(dialogSubscription);
  }

  displayAmount(amt): string {
    return this.utilsService.displayAmount(amt);
  }

  displayToConnectivity(event: any) {
    const result = this.utilsService.sruDisplayToConnectivity(event);
    this.errors = result.$errors;
    if (this.errors.length === 0) {
      delete result.$errors;
      this.unit.attachmentMap = result;
    }
  }

  deleteSRU(): void {
    this.unit.$$deletedCode = this.utilsService.newUUID();
        this.unitDeleted.emit(this.unit);
    }

  getIconFromUuid(): SafeUrl {
    return this.substanceService.getIconFromUuid(this.unit.uuid || this.unit._structure.id);
  }
  }



