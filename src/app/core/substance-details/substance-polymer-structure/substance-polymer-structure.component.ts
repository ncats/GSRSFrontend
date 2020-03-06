import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import {DisplayStructure, Polymer, PolymerClassification, SubstanceDetail} from '../../substance/substance.model';
import { SafeUrl } from '@angular/platform-browser';
import { UtilsService } from '../../utils/utils.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-substance-polymer-structure',
  templateUrl: './substance-polymer-structure.component.html',
  styleUrls: ['./substance-polymer-structure.component.scss']
})
export class SubstancePolymerStructureComponent extends SubstanceCardBase implements OnInit {
  structure: DisplayStructure;
  substanceUpdated = new Subject<SubstanceDetail>();
  classification: PolymerClassification;
  relatedSubstanceUuid: string;

  constructor(
    private utilsService: UtilsService,
  ) {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null) {
        this.structure = this.substance.polymer.idealizedStructure;
        this.classification = this.substance.polymer.classification;
      }
      this.relatedSubstanceUuid = this.classification.parentSubstance && this.classification.parentSubstance.refuuid || '';
    });
  }

  getSafeStructureImgUrl(structureId: string, size: number = 400): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size);
  }
}
