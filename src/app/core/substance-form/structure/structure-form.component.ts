import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import { SubstanceMoiety, SubstanceStructure } from '@gsrs-core/substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { InterpretStructureResponse } from '../../structure/structure-post-response.model';
import { OverlayContainer } from '@angular/cdk/overlay';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-structure-form',
  templateUrl: './structure-form.component.html',
  styleUrls: ['./structure-form.component.scss']
})
export class StructureFormComponent implements OnInit, OnDestroy {
  private privateStructure: SubstanceStructure | SubstanceMoiety = {};
  stereoChemistryTypeList: Array<VocabularyTerm> = [];
  opticalActivityList: Array<VocabularyTerm> = [];
  atropisomerismList: Array<VocabularyTerm> = [];
  optical: string;
  @Input() hideAccess = true;
  @Input() showSettings = false;
  @Input() type?: string;
  @Output() structureImported = new EventEmitter<InterpretStructureResponse>();
  private subscriptions: Array<Subscription> = [];


  constructor(
    private cvService: ControlledVocabularyService,
    private overlayContainerService: OverlayContainer
  ) { }

  ngOnInit() {
    this.getVocabularies();
    this.optical = this.privateStructure.opticalActivity;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  @Input()
  set structure(updatedStructure: SubstanceStructure | SubstanceMoiety) {


    if (updatedStructure != null) {
      this.privateStructure = updatedStructure;
      if (this.privateStructure.opticalActivity === 'NONE' && !this.inCV(this.opticalActivityList, this.privateStructure.opticalActivity)) {
        this.privateStructure.opticalActivity = 'none';
      }
    }
  }

  get structure(): (SubstanceStructure | SubstanceMoiety) {
    if (this.privateStructure.opticalActivity === 'NONE' && !this.inCV(this.opticalActivityList, this.privateStructure.opticalActivity)) {
      this.privateStructure.opticalActivity = 'none';
    }
    return this.privateStructure;
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('STEREOCHEMISTRY_TYPE', 'OPTICAL_ACTIVITY', 'ATROPISOMERISM').subscribe(response => {
      this.stereoChemistryTypeList = response['STEREOCHEMISTRY_TYPE'].list;
      this.opticalActivityList = response['OPTICAL_ACTIVITY'].list;
      this.atropisomerismList = response['ATROPISOMERISM'].list;
    });
  }

  updateAccess(access: Array<string>): void {
    this.privateStructure.access = access;
  }


  inCV(vocab: Array<VocabularyTerm>, property: string): boolean {
    if (vocab) {
      return vocab.some(r => property === r.value);
    } else {
      return true;
    }

  }
}
