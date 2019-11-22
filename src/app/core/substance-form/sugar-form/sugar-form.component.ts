import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Link, Linkage, Site, Sugar} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {ControlledVocabularyService} from '@gsrs-core/controlled-vocabulary';
import {MatDialog} from '@angular/material/dialog';
import {UtilsService} from '@gsrs-core/utils';
import {OverlayContainer} from '@angular/cdk/overlay';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {SubunitSelectorDialogComponent} from '@gsrs-core/substance-form/subunit-selector-dialog/subunit-selector-dialog.component';

@Component({
  selector: 'app-sugar-form',
  templateUrl: './sugar-form.component.html',
  styleUrls: ['./sugar-form.component.scss']
})
export class SugarFormComponent implements OnInit, OnDestroy, AfterViewInit {


  private privateSugar: Sugar;
  @Output() sugarDeleted = new EventEmitter<Sugar>();
  @Input() remaining: Array<Site>;
  deleteTimer: any;
  sugarTypes: any;
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

  ngAfterViewInit() {
    this.updateDisplay();

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  @Input()
  set sugar(sugar: Sugar) {
    this.privateSugar = sugar;
  }

  get sugar(): Sugar {
    this.updateDisplay();
    return this.privateSugar;
  }

  addRemainingSites(): void {
    if (this.privateSugar.sites) {
      this.privateSugar.sites = this.privateSugar.sites.concat(this.remaining);
    } else {
      this.privateSugar.sites = this.remaining;
    }
    this.updateDisplay();
    this.substanceFormService.emitSugarUpdate();
  }

  updateDisplay(sugar?: Sugar): void {
    if (sugar) {
      this.siteDisplay = this.substanceFormService.siteString(sugar.sites);
    } else {
      if(this.privateSugar){
        this.siteDisplay = this.substanceFormService.siteString(this.privateSugar.sites);
      }
    }

  }

  deleteLink(): void {
    this.privateSugar.$$deletedCode = this.utilsService.newUUID();
      this.deleteTimer = setTimeout(() => {
        this.sugarDeleted.emit(this.sugar);
        this.substanceFormService.emitSugarUpdate();
      }, 2000);
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateSugar.$$deletedCode;
  }

  getVocabularies(): void {
    const subscription = this.cvService.getDomainVocabulary('NUCLEIC_ACID_SUGAR').subscribe(response => {
      this.sugarTypes = response['NUCLEIC_ACID_SUGAR'].list;
    });
    this.subscriptions.push(subscription);
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(SubunitSelectorDialogComponent, {
      data: {'card': 'sugar', 'link': this.privateSugar.sites},
      width: '1040px'
    });
    this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().subscribe(newLinks => {
      this.overlayContainer.style.zIndex = null;
      if (newLinks) {
        this.privateSugar.sites = newLinks;
      }
      this.updateDisplay();
      this.substanceFormService.emitSugarUpdate();
    });
    this.subscriptions.push(dialogSubscription);
  }
}
