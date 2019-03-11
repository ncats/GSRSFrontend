import { Component, OnInit } from '@angular/core';
import { SubstanceDetail } from '../../substance/substance.model';
import { SubstanceStructure } from '../../substance/substance.model';
import { StructureService } from '../../structure/structure.service';
import { SafeUrl } from '@angular/platform-browser';
import { SubstanceCardBase } from '../substance-card-base';
import {UtilsService} from '../../utils/utils.service';

@Component({
  selector: 'app-structure-details',
  templateUrl: './structure-details.component.html',
  styleUrls: ['./structure-details.component.scss']
})
export class StructureDetailsComponent extends SubstanceCardBase implements OnInit {
  structure: SubstanceStructure;
  showDef = false;
  showSmiles = false;
  defIcon = 'drop_down';
  smilesIcon = 'drop_down';
  inchi: string;
  showStereo = false;

  constructor(
    private utilService: UtilsService,
    private structureService: StructureService
  ) {
    super();
  }

  ngOnInit() {
    if (this.substance != null) {
      this.structure = this.substance.structure;
      if (this.structure.smiles) {
        this.structureService.getInchi(this.substance.uuid).subscribe(inchi => {
          this.inchi = inchi;
        });
      }
    }
  }

  getSafeStructureImgUrl(stereo: boolean, structureId: string, size: number = 150): SafeUrl {
    return this.utilService.getSafeStructureImgUrl(structureId, size, stereo);
  }

  toggleReferences() {
    this.showDef = !this.showDef;
    if (!this.showDef) {
      this.defIcon = 'drop_down';
    } else {
      this.defIcon = 'drop_up';
    }
  }

  toggleSmiles() {
    this.showSmiles = !this.showSmiles;
    if (!this.showSmiles) {
      this.smilesIcon = 'drop_down';
    } else {
      this.smilesIcon = 'drop_up';
    }
  }

}
