import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AgentModification, Constituent, SubstanceAmount, SubstanceRelated, SubstanceSummary} from '@gsrs-core/substance';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {UtilsService} from '@gsrs-core/utils';
import {OverlayContainer} from '@angular/cdk/overlay';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {AmountFormDialogComponent} from '@gsrs-core/substance-form/amount-form-dialog/amount-form-dialog.component';

@Component({
  selector: 'app-constituent-form',
  templateUrl: './constituent-form.component.html',
  styleUrls: ['./constituent-form.component.scss']
})
export class ConstituentFormComponent implements OnInit {
   privateConstituent: Constituent;
  @Output() constituentDeleted = new EventEmitter<Constituent>();
  deleteTimer: any;
  relatedSubstanceUuid: string;
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
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  @Input()
  set constituent(constituent: Constituent) {
    this.privateConstituent = constituent;
    if (this.constituent.substance) {
      this.relatedSubstanceUuid = this.privateConstituent.substance.refuuid;
    }

  }

  get constituent(): Constituent {
    return this.privateConstituent;
  }

  delete(): void {
    this.privateConstituent.$$deletedCode = this.utilsService.newUUID();
    if (!this.privateConstituent.substance) {
      this.deleteTimer = setTimeout(() => {
        this.constituentDeleted.emit(this.privateConstituent);
      }, 2000);
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateConstituent.$$deletedCode;
  }

  openAmountDialog(): void {
    if (!this.privateConstituent.amount) {
      this.privateConstituent.amount = {};
    }
    const dialogRef = this.dialog.open(AmountFormDialogComponent, {
      data: {'subsAmount': this.privateConstituent.amount},
      width: '990px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newAmount => {
      this.overlayContainer.style.zIndex = null;
      this.privateConstituent.amount = newAmount;
    });
    this.subscriptions.push(dialogSubscription);
  }

  updateProcess(event: string) {
    this.privateConstituent.role = event;
  }

  updateAccess(access: Array<string>): void {
    this.privateConstituent.access = access;
  }

  relatedSubstanceUpdated(substance: SubstanceSummary): void {
    const relatedSubstance: SubstanceRelated = {
      refPname: substance._name,
      name: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    this.privateConstituent.substance = relatedSubstance;
    this.relatedSubstanceUuid = this.privateConstituent.substance.refuuid;
  }

  displayAmount(amt: SubstanceAmount): string {
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
