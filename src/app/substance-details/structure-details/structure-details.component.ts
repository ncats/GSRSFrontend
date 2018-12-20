import { Component, OnInit } from '@angular/core';
import { SubstanceDetail } from '../../substance/substance.model';
import { SubstanceStructure } from '../../substance/substance.model';
import { StructureService } from '../../structure/structure.service';
import { SafeUrl } from '@angular/platform-browser';
import { SubstanceCardBase } from '../substance-card-base';

@Component({
  selector: 'app-structure-details',
  templateUrl: './structure-details.component.html',
  styleUrls: ['./structure-details.component.scss']
})
export class StructureDetailsComponent extends SubstanceCardBase implements OnInit {
  structure: SubstanceStructure;

  constructor(
    private structureService: StructureService
  ) {
    super();
  }

  ngOnInit() {
    if (this.substance != null) {
      this.structure = this.substance.structure;
    }
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.structureService.getSafeStructureImgUrl(structureId, size);
  }

}
