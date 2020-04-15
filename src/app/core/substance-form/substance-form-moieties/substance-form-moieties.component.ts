import { Component, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { SubstanceFormBase } from '../base-classes/substance-form-base';
import { SubstanceFormService } from '../substance-form.service';
import { StructureService } from '../../structure/structure.service';
import { SubstanceMoiety } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-substance-form-moieties',
  templateUrl: './substance-form-moieties.component.html',
  styleUrls: ['./substance-form-moieties.component.scss']
})
export class SubstanceFormMoietiesComponent extends SubstanceFormBase implements OnInit {
  moieties: Array<SubstanceMoiety> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    private structureService: StructureService
  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Moieties');
    this.hiddenStateUpdate.emit(true);
    this.substanceFormService.substanceMoieties.subscribe(moieties => {
      this.moieties = moieties;
      if (moieties && moieties.length > 1) {
        this.hiddenStateUpdate.emit(false);
      } else {
        this.hiddenStateUpdate.emit(true);
      }
    });
  }

}
