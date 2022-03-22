import { Component, OnInit, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { Subscription } from 'rxjs';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../../substance-form/base-classes/substance-form-base-filtered-list';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
/*
import { take } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceFormBase } from '../../substance-form/base-classes/substance-form-base';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
*/
import { SubstanceService } from '../../substance/substance.service';
import { SubstanceSummary, SubstanceRelationship } from '../../substance/substance.model';
import { SpecifiedSubstanceG4mProcess, SubstanceRelated } from '../../substance/substance.model';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { SubstanceFormSsg4mStagesService } from './substance-form-ssg4m-stages.service';
import { SpecifiedSubstanceG4mSite, SpecifiedSubstanceG4mStage } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-ssg4m-stages-form',
  templateUrl: './ssg4m-stages-form.component.html',
  styleUrls: ['./ssg4m-stages-form.component.scss']
})
export class Ssg4mStagesFormComponent implements OnInit, OnDestroy {

  privateStage: SpecifiedSubstanceG4mStage;
  privateProcessIndex: number;
  privateSiteIndex: number;
  privateStageIndex: number;
  substance: SubstanceDetail;
  subscriptions: Array<Subscription> = [];

  constructor(
    public substanceFormSsg4mStagesService: SubstanceFormSsg4mStagesService,
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer,
    private scrollToService: ScrollToService) { }

  @Input()
  set stage(stage: SpecifiedSubstanceG4mStage) {
    this.privateStage = stage;
  }

  get stage(): SpecifiedSubstanceG4mStage {
    return this.privateStage;
  }

  @Input()
  set processIndex(processIndex: number) {
    this.privateProcessIndex = processIndex;
  }

  get processIndex(): number {
    return this.privateProcessIndex;
  }

  @Input()
  set siteIndex(siteIndex: number) {
    this.privateSiteIndex = siteIndex;
  }

  get siteIndex(): number {
    return this.privateSiteIndex;
  }

  @Input()
  set stageIndex(stageIndex: number) {
    this.privateStageIndex = stageIndex;
    // Set the Stage Name
    this.privateStage.stageNumber = String(this.privateStageIndex + 1);
  }

  get stageIndex(): number {
    return this.privateStageIndex;
  }

  ngOnInit(): void {
    // this.substance = this.substanceFormSsg4mStagesService.substance;
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
    });
    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    // this.substanceFormService.unloadSubstance();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  deleteStage(): void {
    this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages.splice(this.stageIndex, 1);
  }

  addStartingMaterial(processIndex: number, siteIndex: number, stageIndex: number) {
    this.substanceFormSsg4mStagesService.addStartingMaterials(processIndex, siteIndex, stageIndex);
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-process-site-stage-startMat-0`, 'center');
    });
  }

  addProcessingMaterial(processIndex: number, siteIndex: number, stageIndex: number) {
    this.substanceFormSsg4mStagesService.addProcessingMaterials(processIndex, siteIndex, stageIndex);
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-process-site-stage-processMat-0`, 'center');
    });
  }

  addResultingMaterial(processIndex: number, siteIndex: number, stageIndex: number) {
    this.substanceFormSsg4mStagesService.addResultingMaterials(processIndex, siteIndex, stageIndex);
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-process-site-stage-resultMat-0`, 'center');
    });
  }

  /*
  addStage(processIndex: number, siteIndex: number) {
    this.substanceFormSsg4mStagesService.addStage(processIndex, siteIndex);
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-process-site-stage-0`, 'center');
    });
  }
  */
}

