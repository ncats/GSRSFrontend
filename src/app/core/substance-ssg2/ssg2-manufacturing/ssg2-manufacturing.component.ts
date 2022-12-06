import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService, VocabularyTerm } from '@gsrs-core/controlled-vocabulary';
import { SubstanceFormBase } from '../../substance-form/base-classes/substance-form-base';
import { SubstanceDetail, SpecifiedSubstanceG2Manufacturing } from '@gsrs-core/substance/substance.model';
import { SubstanceFormSsg2ManufacturingService } from './substance-form-ssg2-manufacturing.service';

@Component({
  selector: 'app-ssg2-manufacturing',
  templateUrl: './ssg2-manufacturing.component.html',
  styleUrls: ['./ssg2-manufacturing.component.scss']
})
export class Ssg2ManufacturingComponent extends SubstanceFormBase implements OnInit, AfterViewInit, OnDestroy {

  private substance: SubstanceDetail;
  manufacturing: Array<SpecifiedSubstanceG2Manufacturing>;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private substanceFormService: SubstanceFormService,
    private substanceFormSsg2ManufacturingService: SubstanceFormSsg2ManufacturingService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService
  ) {
    super();
    this.analyticsEventCategory = 'substance form ssg 2 Manufacturing';
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Manufacturing');
    const substanceSubscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (!substance.specifiedSubstanceG2.manufacturing) {
        substance.specifiedSubstanceG2.manufacturing = [];
      }
        this.substanceFormService.resetState();
        this.manufacturing = substance.specifiedSubstanceG2.manufacturing;
    });
    this.subscriptions.push(substanceSubscription);
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  /*
  addItem(): void {
    this.substanceFormSsg4mProcessService.addProcess();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-process-0`, 'center');
    });
  }
  */

  addItem(): void {
    this.substanceFormSsg2ManufacturingService.addManufacturing();
    /*
    const newManufacturing: SpecifiedSubstanceG2Manufacturing = {};
    this.substance.specifiedSubstanceG2.manufacturing.unshift(newManufacturing);
   // const processIndex = this.substance.specifiedSubstanceG4m.process.push(newProcess);
    this.propertyEmitter.next(this.substance.specifiedSubstanceG2.manufacturing);
    // Add Site
    // this.substanceFormSsg4mSitesService.addSite(processIndex-1);
    */
  }

  confirmDeleteManufacturing(manufactureIndex: number): void {
    this.substanceFormSsg2ManufacturingService.deleteManufacturing(manufactureIndex);
  }

  searchOrganization(): void {

  }

  /*
  updateGradeName(name: string): void {
    this.grade.name = name;
  }

  updateGradeType(type: string): void {
    this.grade.type = type;
  }

  updateAccess(access: Array<string>): void {
    this.grade.access = access;
  }
  */
}