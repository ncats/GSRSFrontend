import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PhysicalModification, SubstanceAmount, SubstanceRelated, SubstanceSummary} from '@gsrs-core/substance';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {UtilsService} from '@gsrs-core/utils';
import {OverlayContainer} from '@angular/cdk/overlay';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {AmountFormDialogComponent} from '@gsrs-core/substance-form/amount-form-dialog/amount-form-dialog.component';
import {PhysicalParameterFormDialogComponent} from '@gsrs-core/substance-form/physical-parameter-form-dialog/physical-parameter-form-dialog.component';

@Component({
  selector: 'app-physical-modification-form',
  templateUrl: './physical-modification-form.component.html',
  styleUrls: ['./physical-modification-form.component.scss']
})
export class PhysicalModificationFormComponent implements OnInit {
  private privateMod: PhysicalModification;
  @Output() modDeleted = new EventEmitter<PhysicalModification>();
  modTypeList: Array<VocabularyTerm> = [];
  modRoleList: Array<VocabularyTerm> = [];
  modProcessList: Array<VocabularyTerm> = [];
  deleteTimer: any;
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
  }

  @Input()
  set mod(mod: PhysicalModification) {
    this.privateMod = mod;

  }

  get mod(): PhysicalModification {
    return this.privateMod;
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('PHYSICAL_MODIFICATION_ROLE').subscribe(response => {
      this.modRoleList = response['PHYSICAL_MODIFICATION_ROLE'].list;
    });
  }

  deleteMod(): void {
    this.privateMod.$$deletedCode = this.utilsService.newUUID();
    if (!this.privateMod
    ) {
      this.deleteTimer = setTimeout(() => {
        this.modDeleted.emit(this.mod);
        this.substanceFormService.emitOtherLinkUpdate();
      }, 1000);
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateMod.$$deletedCode;
  }

  updateAccess(access: Array<string>): void {
    this.mod.access = access;
  }

  openParameterDialog(): void {
    if (!this.mod.parameters) {
      this.mod.parameters = [];
    }
    const dialogRef = this.dialog.open(PhysicalParameterFormDialogComponent, {
      data: this.mod.parameters,
      width: '1080px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newParams => {
      this.overlayContainer.style.zIndex = null;
      if (newParams) {
        this.mod.parameters = newParams;
      }
    });
    this.subscriptions.push(dialogSubscription);
  }

  openPropertyParameter(parameter?: any): void {

    let isNew: boolean;
    if (parameter == null) {
      isNew = true;
      parameter = { amount: {} };
    }
    const parameterCopyString = JSON.stringify(parameter);


    const dialogRef = this.dialog.open(PhysicalParameterFormDialogComponent, {
      data: JSON.parse(parameterCopyString),
      width: '1200px'
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(newParameter => {
      this.overlayContainer.style.zIndex = null;
      if (newParameter != null) {
        if (this.mod.parameters == null) {
          this.mod.parameters = [];
        }
        if (isNew) {
          this.mod.parameters.unshift(newParameter);
        } else {
          Object.keys(newParameter).forEach(key => {
            parameter[key] = newParameter[key];
          });
        }
      }
    });
  }

  deleteParameter(id: number): void {
    this.mod.parameters.splice(id, 1);
  }

  displayAmount(amt: SubstanceAmount): string {
      return this.utilsService.displayAmount(amt);
  }


}
