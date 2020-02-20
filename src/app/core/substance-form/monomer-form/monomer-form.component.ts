import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Monomer, SubstanceRelated, SubstanceSummary} from '@gsrs-core/substance';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {UtilsService} from '@gsrs-core/utils';
import {OverlayContainer} from '@angular/cdk/overlay';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {AmountFormDialogComponent} from '@gsrs-core/substance-form/amount-form-dialog/amount-form-dialog.component';

@Component({
  selector: 'app-monomer-form',
  templateUrl: './monomer-form.component.html',
  styleUrls: ['./monomer-form.component.scss']
})
export class MonomerFormComponent implements OnInit, AfterViewInit {
  privateMonomer: Monomer;
  @Output() monomerDeleted = new EventEmitter<Monomer>();
  deleteTimer: any;
  relatedSubstanceUuid: string;
  private subscriptions: Array<Subscription> = [];
  private overlayContainer: HTMLElement;
  siteDisplay: string;

  constructor(
    private cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private overlayContainerService: OverlayContainer
  ) { }
  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  @Input()
  set monomer(monomer: Monomer) {
    this.privateMonomer = monomer;
    if (this.privateMonomer.monomerSubstance) {
      this.relatedSubstanceUuid = this.privateMonomer.monomerSubstance.refuuid;
    } else {
      this.relatedSubstanceUuid = '';
    }

  }

  get monomer(): Monomer {
    return this.privateMonomer;
  }

  updateType(event: any): void {
    this.privateMonomer.type = event;
  }

  definingChange(event: any): void {
    this.privateMonomer.defining = event.checked;
  }

  ngAfterViewInit(): void {
  }


  deleteComponent(): void {
    this.privateMonomer.$$deletedCode = this.utilsService.newUUID();
    if (!this.privateMonomer || !this.monomer
    ) {
      this.deleteTimer = setTimeout(() => {
        this.monomerDeleted.emit(this.privateMonomer);
      }, 1000);
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateMonomer.$$deletedCode;
  }

  componentUpdated(substance: SubstanceSummary): void {
    const relatedSubstance: SubstanceRelated = {
      refPname: substance._name,
      name: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    this.privateMonomer.monomerSubstance = relatedSubstance;
    this.relatedSubstanceUuid = this.privateMonomer.monomerSubstance.refuuid;

  }

  openAmountDialog(): void {
    if (!this.privateMonomer.amount) {
      this.privateMonomer.amount = {};
    }
    const dialogRef = this.dialog.open(AmountFormDialogComponent, {
      data: {'subsAmount': this.privateMonomer.amount},
      width: '1040px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newAmount => {
      this.overlayContainer.style.zIndex = null;
      this.privateMonomer.amount = newAmount;
    });
    this.subscriptions.push(dialogSubscription);
  }

  displayAmount(amt): string {
    return this.utilsService.displayAmount(amt);
  }

  formatValue(v) {
    if (v) {
      if (typeof v === 'object') {
        if (v.display) {
          return v.display;
        } else if (v.value) {
          return v.value;
        } else {
          return null;
        }
      } else {
        return v;
      }
    }
    return null;
  }

}
