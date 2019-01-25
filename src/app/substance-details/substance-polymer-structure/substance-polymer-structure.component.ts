import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import { DisplayStructure} from '../../substance/substance.model';
import { SafeUrl} from '@angular/platform-browser';
import {UtilsService} from '../../utils/utils.service';

@Component({
  selector: 'app-substance-polymer-structure',
  templateUrl: './substance-polymer-structure.component.html',
  styleUrls: ['./substance-polymer-structure.component.scss']
})
export class SubstancePolymerStructureComponent extends SubstanceCardBase implements OnInit {
  structure: DisplayStructure;

  constructor(
    private utilsService: UtilsService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.substance != null) {
      this.structure = this.substance.polymer.displayStructure;
    }
  }

  getSafeStructureImgUrl(structureId: string, size: number = 400): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size);
  }
}
