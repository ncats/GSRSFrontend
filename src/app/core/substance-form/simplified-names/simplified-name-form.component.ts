import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {SubstanceName, SubstanceNameOrg} from '../../substance/substance.model';
import {ControlledVocabularyService} from '../../controlled-vocabulary/controlled-vocabulary.service';
import {FormControl} from '@angular/forms';
import {MatRadioChange} from '@angular/material/radio';
import {UtilsService} from '../../utils/utils.service';
import {Subscription} from 'rxjs';
import {NameResolverDialogComponent} from '@gsrs-core/name-resolver/name-resolver-dialog.component';
import {OverlayContainer} from '@angular/cdk/overlay';
import {MatDialog} from '@angular/material/dialog';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {SubstanceFormNamesService} from '@gsrs-core/substance-form/names/substance-form-names.service';

@Component({
  selector: 'app-simplified-name-form',
  templateUrl: './simplified-name-form.component.html',
  styleUrls: ['./simplified-name-form.component.scss']
})
export class SimplifiedNameFormComponent implements OnInit, OnDestroy {
  private privateName: SubstanceName;
  @Output() priorityUpdate = new EventEmitter<SubstanceName>();
  @Output() nameDeleted = new EventEmitter<SubstanceName>();
  nameControl = new FormControl('');
  nameTypeControl = new FormControl('');
  deleteTimer: any;
  private subscriptions: Array<Subscription> = [];
  overlayContainer: HTMLElement;
  substanceType = '';
  viewFull = true;
  showStd = false;

  constructor(
    private cvService: ControlledVocabularyService,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private substanceFormService: SubstanceFormService,
    private overlayContainerService: OverlayContainer,
    private nameFormService: SubstanceFormNamesService
  ) {
  }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    const definition = this.substanceFormService.definition.subscribe(def => {
      this.substanceType = def.substanceClass;
    });
    definition.unsubscribe();

    // Protected access by default.
    this.privateName.access = ["protected"]
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  @Input()
  set show(val: boolean) {
    if (val != null) {
      this.viewFull = val;
    }
  }

  get show(): boolean {
    return this.viewFull || null;
  }

  @Input()
  set standardized(val: boolean) {
    if (val != null) {
      this.showStd = val;
    }
  }

  get standardized(): boolean {
    return this.showStd;
  }

  @Input()
  set name(name: SubstanceName) {
    if (name != null) {
      this.privateName = name;
      if (!this.privateName.languages || this.privateName.languages.length === 0) {
        this.privateName.languages = ['en'];
      }
      if (!this.privateName.type) {
        this.privateName.type = 'cn';
      }
    }
  }

  get name(): SubstanceName {
    return this.privateName || {};
  }

  updateAccess(access: Array<string>): void {
    this.privateName.access = access;
  }

  deleteName(): void {
    this.privateName.$$deletedCode = this.utilsService.newUUID();

    if (!this.privateName.name
      && !this.privateName.type
    ) {
      this.deleteTimer = setTimeout(() => {
        this.nameDeleted.emit(this.privateName);
      }, 2000);
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateName.$$deletedCode;
  }

  resolve(): void {
    const dialogRef = this.dialog.open(NameResolverDialogComponent, {
      height: 'auto',
      width: '800px',
      data: {'name': this.privateName.name}
    });
    this.overlayContainer.style.zIndex = '1002';
    dialogRef.afterClosed().subscribe((molfile?: string) => {
      this.overlayContainer.style.zIndex = null;
      if (molfile != null && molfile !== '') {
        this.substanceFormService.resolvedName(molfile);
      }
    }, () => {
    });
  }

  preventNewLine(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }
}
