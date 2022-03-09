import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SubstanceFormBase } from '../../substance-form/base-classes/substance-form-base';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { MatSelectChange } from '@angular/material/select';
import { SubstanceService } from '../../substance/substance.service';
import { SubstanceSummary, SubstanceRelationship } from '../../substance/substance.model';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import { SpecifiedSubstanceG4mProcess, SubstanceRelated } from '../../substance/substance.model';
import { SubstanceFormSsg4mProcessService } from './substance-form-ssg4m-process.service';

@Component({
  selector: 'app-ssg4m-process-form',
  templateUrl: './ssg4m-process-form.component.html',
  styleUrls: ['./ssg4m-process-form.component.scss']
})
export class Ssg4mProcessFormComponent extends SubstanceFormBase implements OnInit, AfterViewInit, OnDestroy {
  private privateProcess: SpecifiedSubstanceG4mProcess;
  parent: SubstanceRelated;
  private subscriptions: Array<Subscription> = [];
  // @Output() noteDeleted = new EventEmitter<SpecifiedSubstanceG4mProcess>();

  constructor(
    private substanceFormSsg4mProcessService: SubstanceFormSsg4mProcessService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService
  ) {
    super();
    this.analyticsEventCategory = 'specified substance groupb 4 manufacturing';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('process');
  //  const processSubscription = this.substanceFormSsg4mProcessService.specifiedSubstanceG4mProcess.subscribe(specifiedSubstanceG4mProcess => {
  //   this.privateProcess = specifiedSubstanceG4mProcess[];
    //  this.relatedSubstanceUuid = this.classification.parentSubstance && this.classification.parentSubstance.refuuid || '';
 //   });
  //  this.subscriptions.push(processSubscription);

 //   this.dropdownSettings = { singleSelection: false, idField: 'value', textField: 'display', selectAllText: 'Select All',
  //    unSelectAllText: 'UnSelect All', itemsShowLimit: 3, allowSearchFilter: true};
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  update(tags: Array<string>): void {
  //  this.classification.polymerSubclass = tags;
  }

  updateType(type: string): void {
  //  this.classification.sourceType = type;
  }

  updateGeometry(type: string): void {
  //  this.classification.polymerGeometry = type;
  }

  updateClass(type: string): void {
     // this.classification.polymerClass = type;
  }

  /*
  parentSubstanceUpdated(substance: SubstanceSummary): void {
    if (substance !== null){
      const relatedSubstance: SubstanceRelated = {
        refPname: substance._name,
        name: substance._name,
        refuuid: substance.uuid,
        substanceClass: 'reference',
        approvalID: substance.approvalID
      };
      this.classification.parentSubstance = relatedSubstance;
      this.relatedSubstanceUuid = relatedSubstance && relatedSubstance.refuuid || '';
    } else {
      this.classification.parentSubstance = null;
      this.relatedSubstanceUuid = null;
    }
  }
  */

  updateAccess(access: Array<string>): void {
   // this.classification.access = access;
  }
}

