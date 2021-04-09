import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {StructurallyDiverse} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import {ControlledVocabularyService} from '@gsrs-core/controlled-vocabulary';
import { SubstanceFormBase } from '../../base-classes/substance-form-base';
import { SubstanceFormStructurallyDiverseService } from '../substance-form-structurally-diverse.service';

@Component({
  selector: 'app-substance-form-structurally-diverse-source',
  templateUrl: './substance-form-structurally-diverse-source.component.html',
  styleUrls: ['./substance-form-structurally-diverse-source.component.scss']
})
export class SubstanceFormStructurallyDiverseSourceComponent  extends SubstanceFormBase
  implements OnInit, AfterViewInit, OnDestroy {
    confirm = false;
  structurallyDiverse: StructurallyDiverse;
  private subscriptions: Array<Subscription> = [];
  part?: string;

  constructor(
    private substanceFormStructurallyDiverseService: SubstanceFormStructurallyDiverseService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService
  ) {
    super();
    this.analyticsEventCategory = 'substance form Source Material';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Source Material');
    const structurallyDiverseSubscription = this.substanceFormStructurallyDiverseService
      .substanceStructurallyDiverse.subscribe(structurallyDiverse => {
      this.structurallyDiverse = structurallyDiverse;
      console.log('upadted ' + this.structurallyDiverse.$$diverseType + this.part);
      if (!this.structurallyDiverse.$$diverseType) {
        if (this.structurallyDiverse.part.length === 1 && this.structurallyDiverse.part[0].toUpperCase() === ('WHOLE')) {
          if (this.checkParts() === false) {
            this.structurallyDiverse.$$diverseType = 'full_fields';
            this.part = 'full_fields';

          } else {
            this.structurallyDiverse.$$diverseType = 'whole';
            this.part = 'whole';

          }
        } else {
          if (this.checkWhole() === false) {
            this.structurallyDiverse.$$diverseType = 'full_fields';
            this.part = 'full_fields';

          } else {
            this.structurallyDiverse.$$diverseType = 'fraction';
            this.part = 'fraction';


          }

          for ( let i = 0; i < this.structurallyDiverse.part.length; i++) {
              if ( this.structurallyDiverse.part[i].toUpperCase() === ('WHOLE')) {
              }
          }
        }
      }
    });
    this.subscriptions.push(structurallyDiverseSubscription);
  }

  ngAfterViewInit() {
  }

  updateAccess(access: Array<string>): void {
    this.structurallyDiverse.access = access;
  }

  update(field: string, event: any): void {
    if (field === 'type') {

      this.structurallyDiverse.sourceMaterialType = event;
    } else if (field === 'class') {
      this.structurallyDiverse.sourceMaterialClass = event;
      this.substanceFormStructurallyDiverseService.emitStructurallyDiverseUpdate();
    } else if (field === 'state') {
      this.structurallyDiverse.sourceMaterialState = event;
    }
  }

  checkParts(): boolean {

    if (this.structurallyDiverse.partLocation && this.structurallyDiverse.partLocation !== null &&
      this.structurallyDiverse.partLocation !== '' ) {
        return false;
      } else if (this.structurallyDiverse.fractionName && this.structurallyDiverse.fractionName !== null &&
        this.structurallyDiverse.fractionName !== '' ) {
          return false;
        }  else if (this.structurallyDiverse.fractionMaterialType && this.structurallyDiverse.fractionMaterialType !== null &&
          this.structurallyDiverse.fractionMaterialType !== '' ) {
            return false;
          } else {
            return true;
          }
  }

  checkWhole(): boolean {
    const check = ['organismFamily', 'organismGenus', 'organismSpecies', 'organismAuthor', 'infraSpecificType', 'infraSpecificName',
     'hybridSpeciesMaternalOrganism', 'hybridSpeciesPaternalOrganism'];
    let found = true;
    check.forEach( field => {
      if (this.structurallyDiverse[field] && this.structurallyDiverse[field] !== null &&
        this.structurallyDiverse[field] !== '' &&
        this.structurallyDiverse[field] !== {} ) {
         found = false;
        }
    });
    return found;
  }

  updateType(event: any): void {
    this.confirm = false;
    console.log(event.value);
    if (event.value && event.value !== '' && event.value !== null) {
      this.part = event.value;
    }
    if (event.value === 'whole') {
      if (this.checkParts()) {
        this.confirm = false;
      } else {
        this.confirm = true;
      }
      if (this.structurallyDiverse.$$diverseType === 'fraction') {
        this.structurallyDiverse.$$storedPart = this.structurallyDiverse.part;

      }
      this.structurallyDiverse.part = ['WHOLE'];
    } else {
      if (event.value === 'full_fields') {
        this.structurallyDiverse.$$diverseType = event.value;
        } else {

          if (this.checkWhole()) {
            this.confirm = false;
          } else {
            this.confirm = true;
          }
          this.structurallyDiverse.$$diverseType = event.value;
       if (this.structurallyDiverse.$$storedPart) {
          this.structurallyDiverse.part = this.structurallyDiverse.$$storedPart;
        } 
      }
    }
    this.structurallyDiverse.$$diverseType = event.value;
  //  this.structurallyDiverse.$$diverseType = event.value;
    this.substanceFormStructurallyDiverseService.emitStructurallyDiverseUpdate();
  }

  clean() {
    if (this.structurallyDiverse.$$diverseType === 'fraction') {
      const check = ['organismFamily', 'organismGenus', 'organismSpecies', 'organismAuthor', 'infraSpecificType', 'infraSpecificName',
      'hybridSpeciesMaternalOrganism', 'hybridSpeciesPaternalOrganism'];
            check.forEach( field => {
        if (this.structurallyDiverse[field] && this.structurallyDiverse[field] !== null &&
          this.structurallyDiverse[field] !== '' ) {
          //  this.structurallyDiverse[field] = null;
          delete this.structurallyDiverse[field];
          }
      });
    } else {
      if (this.structurallyDiverse.partLocation && this.structurallyDiverse.partLocation !== null) {
          delete  this.structurallyDiverse.partLocation;
        }
         if (this.structurallyDiverse.fractionName && this.structurallyDiverse.fractionName !== null) {
            delete this.structurallyDiverse.fractionName;
          }
          if (this.structurallyDiverse.fractionMaterialType && this.structurallyDiverse.fractionMaterialType !== null) {
              delete this.structurallyDiverse.fractionMaterialType;
            }
            if (this.structurallyDiverse.parentSubstance && this.structurallyDiverse.parentSubstance !== null ) {
                delete this.structurallyDiverse.fractionMaterialType;
              }
    }
    this.confirm = false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
