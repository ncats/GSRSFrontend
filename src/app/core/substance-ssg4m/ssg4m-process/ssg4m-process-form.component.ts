import { Component, OnInit, AfterViewInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceService } from '../../substance/substance.service';
import { SubstanceFormBase } from '../../substance-form/base-classes/substance-form-base';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { SpecifiedSubstanceG4mProcess, SubstanceRelated } from '../../substance/substance.model';
import { SubstanceFormSsg4mProcessService } from './substance-form-ssg4m-process.service';
import { SubstanceFormSsg4mSitesService } from '../ssg4m-sites/substance-form-ssg4m-sites.service';
import { ConfirmDialogComponent } from '../../../fda/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ssg4m-process-form',
  templateUrl: './ssg4m-process-form.component.html',
  styleUrls: ['./ssg4m-process-form.component.scss']
})
export class Ssg4mProcessFormComponent implements OnInit, OnDestroy {
  @Output() tabSelectedIndexOut = new EventEmitter<number>();

  tabSelectedIndex: number;
  private privateShowAdvancedSettings: boolean;
  public configSettingsDisplay = {};
  private privateProcessIndex: number;
  private privateTabSelectedView: string;
  private privateProcess: SpecifiedSubstanceG4mProcess;
  parent: SubstanceRelated;
  private substance: SubstanceDetail;
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormSsg4mProcessService: SubstanceFormSsg4mProcessService,
    private substanceFormSsg4mSitesService: SubstanceFormSsg4mSitesService,
    private substanceFormService: SubstanceFormService,
    private configService: ConfigService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService,
    private overlayContainerService: OverlayContainer,
    private scrollToService: ScrollToService,
    private dialog: MatDialog
  ) {
  }

  ngAfterViewInit(): void {
  }

  @Input()
  set process(process: SpecifiedSubstanceG4mProcess) {
    this.privateProcess = process;
  }

  get process(): SpecifiedSubstanceG4mProcess {
    return this.privateProcess;
  }

  @Input()
  set processIndex(processIndex: number) {
    this.privateProcessIndex = processIndex;
    // Set the Process Name
    this.privateProcess.processName = 'Process ' + (this.processIndex + 1);
  }

  get processIndex(): number {
    return this.privateProcessIndex;
  }

  @Input()
  set showAdvancedSettings(showAdvancedSettings: boolean) {
    this.privateShowAdvancedSettings = showAdvancedSettings;
    // Get Config Settins from config file
    this.getConfigSettings();
  }

  get showAdvancedSettings(): boolean {
    return this.privateShowAdvancedSettings;
  }

  @Input()
  set tabSelectedView(tabSelectedView: string) {
    this.privateTabSelectedView = tabSelectedView;
  }

  get tabSelectedView(): string {
    return this.privateTabSelectedView;
  }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getConfigSettings(): void {
    // Get SSG4 Config Settings from config.json file to show and hide fields in the form
    let configSsg4Form: any;
    configSsg4Form = this.configService.configData && this.configService.configData.ssg4Form || null;
    // Get 'process' json values from config
    const confSettings = configSsg4Form.settingsDisplay.process;
    Object.keys(confSettings).forEach(key => {
      if (confSettings[key] != null) {
        if (confSettings[key] === 'simple') {
          this.configSettingsDisplay[key] = true;
        } else if (confSettings[key] === 'advanced') {
          if (this.privateShowAdvancedSettings === true) {
            this.configSettingsDisplay[key] = true;
          } else {
            this.configSettingsDisplay[key] = false;
          }
        }
      }
    });
  }

  updateAccess() {

  }

  addSite() {
    this.substanceFormSsg4mSitesService.addSite(this.processIndex);
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-process-site-0`, 'center');
    });
  }

  confirmDeleteProcess() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Process ' + (this.processIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteProcess();
      }
    });
  }

  deleteProcess() {
    this.substanceFormSsg4mProcessService.deleteProcess(this.privateProcess, this.processIndex);
  }

  tabSelectedIndexOutChange(index: number) {
    this.tabSelectedIndexOut.emit(index);
  }
}

