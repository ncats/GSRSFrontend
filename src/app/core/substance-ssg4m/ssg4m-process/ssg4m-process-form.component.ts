import { Component, OnInit, AfterViewInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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

@Component({
  selector: 'app-ssg4m-process-form',
  templateUrl: './ssg4m-process-form.component.html',
  styleUrls: ['./ssg4m-process-form.component.scss']
})
export class Ssg4mProcessFormComponent implements OnInit, OnDestroy {
  // @Input() showAdvancedSettings: boolean;
  private privatesShowAdvancedSettings: boolean;
  private privateProcessIndex: number;
  private privateProcess: SpecifiedSubstanceG4mProcess;
  parent: SubstanceRelated;
  private substance: SubstanceDetail;
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormSsg4mProcessService: SubstanceFormSsg4mProcessService,
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService,
    private overlayContainerService: OverlayContainer,
    private scrollToService: ScrollToService,
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
    this.privatesShowAdvancedSettings = showAdvancedSettings;
  }

  get showAdvancedSettings(): boolean {
    return this.privatesShowAdvancedSettings;
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

  deleteProcess() {
    this.substanceFormSsg4mProcessService.deleteProcess(this.privateProcess, this.processIndex);
    // this.substance.specifiedSubstanceG4m.process.splice(this.processIndex, 1);
  }

  updateAccess() {

  }

  addSite() {
    this.substanceFormSsg4mProcessService.addSite(this.processIndex);
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-process-site-0`, 'center');
    });
  }

}

