import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {StructurallyDiverse} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {IDropdownSettings} from 'ng-multiselect-dropdown';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import { SubstanceFormBase } from '../substance-form-base';

@Component({
  selector: 'app-substance-form-structurally-diverse-organism',
  templateUrl: './substance-form-structurally-diverse-organism.component.html',
  styleUrls: ['./substance-form-structurally-diverse-organism.component.scss']
})
export class SubstanceFormStructurallyDiverseOrganismComponent extends SubstanceFormBase
  implements OnInit, AfterViewInit, OnDestroy {
  part: string;
  paternalUuid: string;
  maternalUuid: string;
  parentUuid: string;
  structurallyDiverse: StructurallyDiverse;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService
  ) {
    super();
    this.analyticsEventCategory = 'substance form structural modification structurally diverse organism';
  }

  ngOnInit() {
    const structurallyDiverseSubscription = this.substanceFormService.substanceStructurallyDiverse.subscribe(structurallyDiverse => {
      this.structurallyDiverse = structurallyDiverse;
      this.part = this.structurallyDiverse.$$diverseType;
      if (this.part === 'whole') {
        this.menuLabelUpdate.emit('Organism Details');
        this.maternalUuid = this.structurallyDiverse.hybridSpeciesMaternalOrganism
          && this.structurallyDiverse.hybridSpeciesMaternalOrganism.refuuid || '';
        this.paternalUuid = this.structurallyDiverse.hybridSpeciesPaternalOrganism
          && this.structurallyDiverse.hybridSpeciesPaternalOrganism.refuuid || '';
      } else {
        this.menuLabelUpdate.emit('Parts And Fractions');
        this.parentUuid = this.structurallyDiverse.parentSubstance
          && this.structurallyDiverse.parentSubstance.refuuid || '';
      }
    });
    this.subscriptions.push(structurallyDiverseSubscription);
  }

  ngAfterViewInit() {
  }

  updateType(event): void {
    this.structurallyDiverse.infraSpecificType = event;
  }

  updateStage(event): void {
    this.structurallyDiverse.developmentalStage = event;
  }

  paternalUpdated(substance: SubstanceSummary): void {
    const relatedSubstance: SubstanceRelated = {
      refPname: substance._name,
      name: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    this.structurallyDiverse.hybridSpeciesPaternalOrganism = relatedSubstance;
  }
    
  maternalUpdated(substance: SubstanceSummary): void {
    const relatedSubstance: SubstanceRelated = {
      refPname: substance._name,
      name: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    this.structurallyDiverse.hybridSpeciesMaternalOrganism = relatedSubstance;
  }
    
  sourceMaterialUpdated(substance: SubstanceSummary): void {
    const relatedSubstance: SubstanceRelated = {
      refPname: substance._name,
      name: substance._name,
      refuuid: substance.uuid,
      substanceClass: 'reference',
      approvalID: substance.approvalID
    };
    this.structurallyDiverse.parentSubstance = relatedSubstance;
  }

  updateLocation(event): void {
    this.structurallyDiverse.partLocation = event;
  }

  updateMaterialType(event): void {
    this.structurallyDiverse.fractionMaterialType = event;
  }

  updateDevelopmentalStage(event): void {
    this.structurallyDiverse.developmentalStage = event;
  }

  updatePart(tags:  Array<string>): void {
    this.structurallyDiverse.part = tags;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
