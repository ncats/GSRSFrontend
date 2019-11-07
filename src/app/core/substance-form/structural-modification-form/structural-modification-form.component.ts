import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StructuralModification, SubstanceCode, SubstanceRelated, SubstanceSummary} from '@gsrs-core/substance';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {UtilsService} from '@gsrs-core/utils';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {OverlayContainer} from '@angular/cdk/overlay';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {AmountFormDialogComponent} from '@gsrs-core/substance-form/amount-form-dialog/amount-form-dialog.component';

@Component({
  selector: 'app-structural-modification-form',
  templateUrl: './structural-modification-form.component.html',
  styleUrls: ['./structural-modification-form.component.scss']
})
export class StructuralModificationFormComponent implements OnInit, AfterViewInit {
  private privateMod: StructuralModification;
  @Output() modDeleted = new EventEmitter<StructuralModification>();
  modExtentList: Array<VocabularyTerm> = [];
  modSystemDictionary: { [termValue: string]: VocabularyTerm };
  modLocationList: Array<VocabularyTerm> = [];
  modSystemType: string;
  modTypeList: Array<VocabularyTerm> = [];
  deleteTimer: any;
  relatedSubstanceUuid: string;
  private subscriptions: Array<Subscription> = [];
  private overlayContainer: HTMLElement;
  siteDisplay: string;
  substanceType: string;

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
    this.updateDisplay();
    this.getSubstanceType();
  }

  @Input()
  set mod(mod: StructuralModification) {
    this.privateMod = mod;
    this.relatedSubstanceUuid = this.privateMod.molecularFragment && this.privateMod.molecularFragment.refuuid || '';
  }

  get mod(): StructuralModification {
    return this.privateMod;
  }

  getSubstanceType(): void {
    const definitionSubscription = this.substanceFormService.definition.subscribe( definition => {
      this.substanceType = definition.substanceClass;
    });
    definitionSubscription.unsubscribe();
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('STRUCTURAL_MODIFICATION_TYPE', 'LOCATION_TYPE', 'EXTENT_TYPE').subscribe(response => {
      this.modTypeList = response['STRUCTURAL_MODIFICATION_TYPE'].list;
      this.modLocationList = response['LOCATION_TYPE'].list;
      this.modExtentList = response['EXTENT_TYPE'].list;
    });
  }

  deleteCode(): void {
    this.privateMod.$$deletedCode = this.utilsService.newUUID();
    if (!this.privateMod
    ) {
      this.deleteTimer = setTimeout(() => {
        this.modDeleted.emit(this.privateMod);
      }, 2000);
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateMod.$$deletedCode;
  }

  updateAccess(access: Array<string>): void {
    this.mod.access = access;
  }

  relatedSubstanceUpdated(substance: SubstanceSummary): void {
    const relatedSubstance: SubstanceRelated = {
      refPname: substance._name,
      name: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    this.mod.molecularFragment = relatedSubstance;
    this.relatedSubstanceUuid = this.mod.molecularFragment.refuuid;
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(SubunitSelectorDialogComponent, {
      data: {'card': 'other', 'link': this.mod.sites},
      width: '990px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newLinks => {
      this.overlayContainer.style.zIndex = null;
      this.mod.sites = newLinks;
      this.updateDisplay();
      this.substanceFormService.emitStructralModificationsUpdate();
    });
    this.subscriptions.push(dialogSubscription);
  }

  openAmountDialog(): void {
    if (!this.mod.extentAmount) {
      this.mod.extentAmount = {};
    }
    const dialogRef = this.dialog.open(AmountFormDialogComponent, {
      data: {'subsAmount': this.mod.extentAmount},
      width: '1040px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newAmount => {
      this.overlayContainer.style.zIndex = null;
      this.mod.extentAmount = newAmount;
    });
    this.subscriptions.push(dialogSubscription);
  }

  updateDisplay(): void {
    this.siteDisplay = this.substanceFormService.siteString(this.mod.sites);
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
