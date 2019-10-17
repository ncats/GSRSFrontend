import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
export class StructuralModificationFormComponent implements OnInit {
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
  }

  @Input()
  set mod(mod: StructuralModification) {
    this.privateMod = mod;
    this.relatedSubstanceUuid = this.privateMod.molecularFragment.refuuid;
  }

  get mod(): StructuralModification {
    return this.privateMod;
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('STRUCTURAL_MODIFICATION_TYPE', 'LOCATION_TYPE', 'EXTENT_TYPE').subscribe(response => {
      console.log(response);
      this.modTypeList = response['STRUCTURAL_MODIFICATION_TYPE'].list;
      this.modLocationList = response['LOCATION_TYPE'].list;
     // this.setCodeSystemType();
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
    });
    this.subscriptions.push(dialogSubscription);
  }

  openAmountDialog(): void {
    console.log(this.mod.extentAmount);
    if(!this.mod.extentAmount){
      this.mod.extentAmount = {};
    }
    const dialogRef = this.dialog.open(AmountFormDialogComponent, {
      data: {'subsAmount': this.mod.extentAmount},
      width: '990px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newAmount => {
      this.overlayContainer.style.zIndex = null;
      this.mod.extentAmount = newAmount;
    });
    this.subscriptions.push(dialogSubscription);
  }

  updateDisplay(): void {
    console.log(this.mod.sites);
    this.siteDisplay = this.substanceFormService.siteString(this.mod.sites);
  }

  displayAmount(amt): string {
    let ret = '';
    if (amt) {
      if (typeof amt === 'object') {
        if (amt) {
          let addedunits = false;
          let unittext = this.formatValue(amt.units);
          if (!unittext) {
            unittext = '';
          }
          const atype = this.formatValue(amt.type);
          if (atype) {
            ret += atype + '\n';
          }
          if (amt.average || amt.high || amt.low) {
            if (amt.average) {
              ret += amt.average;
              if (amt.units) {
                ret += ' ' + unittext;
                addedunits = true;
              }
            }
            if (amt.high || amt.low) {
              ret += ' [';
              if (amt.high && !amt.low) {
                ret += '<' + amt.high;
              } else if (!amt.high && amt.low) {
                ret += '>' + amt.low;
              } else if (amt.high && amt.low) {
                ret += amt.low + ' to ' + amt.high;
              }
              ret += '] ';
              if (!addedunits) {
                if (amt.units) {
                  ret += ' ' + unittext;
                  addedunits = true;
                }
              }
            }
            ret += ' (average) ';
          }
          if (amt.highLimit || amt.lowLimit) {
            ret += '\n[';
          }
          if (amt.highLimit && !amt.lowLimit) {
            ret += '<' + amt.highLimit;
          } else if (!amt.highLimit && amt.lowLimit) {
            ret += '>' + amt.lowLimit;
          } else if (amt.highLimit && amt.lowLimit) {
            ret += amt.lowLimit + ' to ' + amt.highLimit;
          }
          if (amt.highLimit || amt.lowLimit) {
            ret += '] ';
            if (!addedunits) {
              if (amt.units) {
                ret += ' ' + unittext;
                addedunits = true;
              }
            }
            ret += ' (limits)';
          }
        }
      }
    }
    return ret;
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
