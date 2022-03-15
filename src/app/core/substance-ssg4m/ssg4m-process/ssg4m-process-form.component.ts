import { Component, OnInit, AfterViewInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SubstanceFormBase } from '../../substance-form/base-classes/substance-form-base';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { MatSelectChange } from '@angular/material/select';
import { SubstanceService } from '../../substance/substance.service';
import { SubstanceSummary, SubstanceRelationship } from '../../substance/substance.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { SpecifiedSubstanceG4mProcess, SubstanceRelated } from '../../substance/substance.model';
import { SubstanceFormSsg4mProcessService } from './substance-form-ssg4m-process.service';

@Component({
  selector: 'app-ssg4m-process-form',
  templateUrl: './ssg4m-process-form.component.html',
  styleUrls: ['./ssg4m-process-form.component.scss']
})
export class Ssg4mProcessFormComponent implements OnInit {
  @Input() processIndex: number;
  private privateProcess: SpecifiedSubstanceG4mProcess;
  parent: SubstanceRelated;
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];
  // @Output() noteDeleted = new EventEmitter<SpecifiedSubstanceG4mProcess>();

  constructor(
    private substanceFormSsg4mProcessService: SubstanceFormSsg4mProcessService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService,
    private overlayContainerService: OverlayContainer,
    private scrollToService: ScrollToService,
  ) {
  }

  ngOnInit() {
    //  this.getVocabularies();
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    //  this.updateDisplay();
    //  this.getSubstanceType();
  }

  ngAfterViewInit(): void {

  }

  @Input()
  set process(process: SpecifiedSubstanceG4mProcess) {
    this.privateProcess = process;
    //  this.relatedSubstanceUuid = this.privateMod.molecularFragment && this.privateMod.molecularFragment.refuuid || '';
  }

  get process(): SpecifiedSubstanceG4mProcess {
    return this.privateProcess;
  }

  deleteProcess() {

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

