import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import { SubstanceMoiety } from '../../substance/substance.model';
import { StructureService } from '../../structure/structure.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-substance-moieties',
  templateUrl: './substance-moieties.component.html',
  styleUrls: ['./substance-moieties.component.scss']
})
export class SubstanceMoietiesComponent extends SubstanceCardBase implements OnInit {
  moieties: Array<SubstanceMoiety> = [];

  constructor(private structureService: StructureService) {
    super();
  }

  ngOnInit() {
    if (this.substance != null && this.substance.moieties != null) {
      this.moieties = this.substance.moieties;
    }
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.structureService.getSafeStructureImgUrl(structureId, size);
  }

}
