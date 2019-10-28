import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PhysicalModification, SubstanceAmount, SubstanceRelated, SubstanceSummary} from '@gsrs-core/substance';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {UtilsService} from '@gsrs-core/utils';
import {OverlayContainer} from '@angular/cdk/overlay';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {AmountFormDialogComponent} from '@gsrs-core/substance-form/amount-form-dialog/amount-form-dialog.component';
import {PropertyParameterDialogComponent} from '@gsrs-core/substance-form/property-parameter-dialog/property-parameter-dialog.component';
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



  openParameterDialog(): void {
    if (!this.mod.parameters) {
      this.mod.parameters = [];
    }
    const dialogRef = this.dialog.open(PhysicalParameterFormDialogComponent, {
      data: this.mod.parameters,
      width: '990px'
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

  displayAmount(amt: SubstanceAmount): string {
      return this.utilsService.displayAmount(amt);
  }


}
