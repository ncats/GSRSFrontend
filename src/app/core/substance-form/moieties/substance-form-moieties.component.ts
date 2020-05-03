import { Component, OnInit, OnDestroy } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { SubstanceFormBase } from '../base-classes/substance-form-base';
import { StructureService } from '../../structure/structure.service';
import { SubstanceMoiety } from '@gsrs-core/substance/substance.model';
import { SubstanceFormStructureService } from '../structure/substance-form-structure.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-substance-form-moieties',
  templateUrl: './substance-form-moieties.component.html',
  styleUrls: ['./substance-form-moieties.component.scss']
})
export class SubstanceFormMoietiesComponent extends SubstanceFormBase implements OnInit, OnDestroy {
  moieties: Array<SubstanceMoiety> = [];
  subscription: Subscription;

  constructor(
    private substanceFormStructureService: SubstanceFormStructureService
  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Moieties');
    this.hiddenStateUpdate.emit(true);
    this.subscription = this.substanceFormStructureService.substanceMoieties.subscribe(moieties => {
      this.moieties = moieties;
      if (moieties && moieties.length > 1) {
        this.hiddenStateUpdate.emit(false);
      } else {
        this.hiddenStateUpdate.emit(true);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
