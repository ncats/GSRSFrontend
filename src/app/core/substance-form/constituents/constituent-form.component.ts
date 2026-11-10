import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AgentModification, Constituent, SubstanceAmount, SubstanceRelated, SubstanceSummary} from '@gsrs-core/substance';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {UtilsService} from '@gsrs-core/utils';
import {OverlayContainer} from '@angular/cdk/overlay';
import {AmountFormDialogComponent} from '@gsrs-core/substance-form/amount-form-dialog/amount-form-dialog.component';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {AccessManagerComponent} from '@gsrs-core/substance-form/access-manager/access-manager.component';
import {CvInputComponent} from '@gsrs-core/substance-form/cv-input/cv-input.component';
import {DomainReferencesComponent} from '@gsrs-core/substance-form/references/domain-references/domain-references.component';
import {SubstanceSelectorComponent} from '@gsrs-core/substance-selector/substance-selector.component';

@Component({
    selector: 'app-constituent-form',
    templateUrl: './constituent-form.component.html',
    styleUrls: ['./constituent-form.component.scss'],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, MatTooltipModule, AccessManagerComponent, CvInputComponent, DomainReferencesComponent, SubstanceSelectorComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConstituentFormComponent implements OnInit {
   privateConstituent: Constituent;
  @Output() constituentDeleted = new EventEmitter<Constituent>();
  @Output() amountUpdated = new EventEmitter<any>();
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
    private cdr: ChangeDetectorRef
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
      if (newAmount) {
        this.privateConstituent.amount = newAmount;
        this.amountUpdated.emit(this.privateConstituent.amount);
      }
      this.cdr.markForCheck();
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
