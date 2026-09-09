import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import {DisplayStructure, Polymer, PolymerClassification, SubstanceDetail} from '../../substance/substance.model';
import {Subject} from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SubstanceImageDirective } from '@gsrs-core/substance/substance-image.directive';

@Component({
    selector: 'app-substance-polymer-structure',
    templateUrl: './substance-polymer-structure.component.html',
    styleUrls: ['./substance-polymer-structure.component.scss'],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTooltipModule, RouterModule, SubstanceImageDirective]
})
export class SubstancePolymerStructureComponent extends SubstanceCardBase implements OnInit {
  structure: DisplayStructure;
  substanceUpdated = new Subject<SubstanceDetail>();
  classification: PolymerClassification;
  relatedSubstanceUuid: string;
  molfileHref: any;


  constructor(
    private sanitizer: DomSanitizer,
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
      const theJSON = this.structure.molfile;
        const uri = this.sanitizer.bypassSecurityTrustUrl('data:text;charset=UTF-8,' + encodeURIComponent(theJSON));
        this.molfileHref = uri;
    });
  }
}
