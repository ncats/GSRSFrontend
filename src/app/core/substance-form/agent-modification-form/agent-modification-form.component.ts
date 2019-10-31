import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AmountFormDialogComponent} from '@gsrs-core/substance-form/amount-form-dialog/amount-form-dialog.component';
import {AgentModification, StructuralModification, SubstanceAmount, SubstanceRelated, SubstanceSummary} from '@gsrs-core/substance';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {UtilsService} from '@gsrs-core/utils';
import {OverlayContainer} from '@angular/cdk/overlay';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';

@Component({
  selector: 'app-agent-modification-form',
  templateUrl: './agent-modification-form.component.html',
  styleUrls: ['./agent-modification-form.component.scss']
})
export class AgentModificationFormComponent implements OnInit {
  private privateMod: AgentModification;
  @Output() modDeleted = new EventEmitter<AgentModification>();
  modTypeList: Array<VocabularyTerm> = [];
  modRoleList: Array<VocabularyTerm> = [];
  modProcessList: Array<VocabularyTerm> = [];
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
  }

  @Input()
  set mod(mod: AgentModification) {
    this.privateMod = mod;
    if(this.privateMod.agentSubstance){
      this.relatedSubstanceUuid = this.privateMod.agentSubstance.refuuid;
    }

  }

  get mod(): AgentModification {
    return this.privateMod;
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('AGENT_MODIFICATION_TYPE', 'AGENT_MODIFICATION_PROCESS', 'ROLE').subscribe(response => {
      this.modTypeList = response['AGENT_MODIFICATION_TYPE'].list;
      this.modProcessList = response['AGENT_MODIFICATION_PROCESS'].list;
      this.modRoleList = response['ROLE'].list;
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

  openAmountDialog(): void {
    if (!this.mod.amount) {
      this.mod.amount = {};
    }
    const dialogRef = this.dialog.open(AmountFormDialogComponent, {
      data: {'subsAmount': this.mod.amount},
      width: '990px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newAmount => {
      this.overlayContainer.style.zIndex = null;
      this.mod.amount = newAmount;
    });
    this.subscriptions.push(dialogSubscription);
  }

  updateProcess(event: string){
    this.privateMod.agentModificationProcess = event;
    console.log(event);
  }

  relatedSubstanceUpdated(substance: SubstanceSummary): void {
    const relatedSubstance: SubstanceRelated = {
      refPname: substance._name,
      name: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    this.mod.agentSubstance = relatedSubstance;
    this.relatedSubstanceUuid = this.mod.agentSubstance.refuuid;
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
