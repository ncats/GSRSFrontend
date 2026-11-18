import { Component, OnInit, OnDestroy } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { SubstanceFormBase } from '../base-classes/substance-form-base';
import { StructureService } from '../../structure/structure.service';
import { SubstanceMoiety } from '@gsrs-core/substance/substance.model';
import { SubstanceFormStructureService } from '../structure/substance-form-structure.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { AmountFormComponent } from '@gsrs-core/substance-form/amount-form/amount-form.component';
import { StructureFormComponent } from '@gsrs-core/substance-form/structure/structure-form.component';
import { SubstanceImageDirective } from '@gsrs-core/substance/substance-image.directive';

@Component({
    selector: 'app-substance-form-moieties',
    templateUrl: './substance-form-moieties.component.html',
    styleUrls: ['./substance-form-moieties.component.scss'],
    standalone: true,
    imports: [CommonModule, MatDividerModule, AmountFormComponent, StructureFormComponent, SubstanceImageDirective]
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
