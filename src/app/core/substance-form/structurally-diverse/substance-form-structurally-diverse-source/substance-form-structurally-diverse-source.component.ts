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

  structurallyDiverse: StructurallyDiverse;
  private subscriptions: Array<Subscription> = [];

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
      if (!this.structurallyDiverse.$$diverseType) {
        if (this.structurallyDiverse.part.length === 1 && this.structurallyDiverse.part[0].toUpperCase() === ('WHOLE')) {
          this.structurallyDiverse.$$diverseType = 'whole';
        } else {
          this.structurallyDiverse.$$diverseType = 'fraction';
        }
      }
    });
    this.subscriptions.push(structurallyDiverseSubscription);
  }

  ngAfterViewInit() {
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

  updateType(event: any): void {
    this.structurallyDiverse.$$diverseType = event.value;
    if (this.structurallyDiverse.$$diverseType === 'whole') {
      this.structurallyDiverse.$$storedPart = this.structurallyDiverse.part;
      this.structurallyDiverse.part = ['WHOLE'];
    } else {

      if (this.structurallyDiverse.$$storedPart) {
        this.structurallyDiverse.part = this.structurallyDiverse.$$storedPart;
      } else {
        this.structurallyDiverse.part = [];
      }
    }
    this.substanceFormStructurallyDiverseService.emitStructurallyDiverseUpdate();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
