import { Component, OnInit } from '@angular/core';
import { SubstanceStructure } from '../../substance/substance.model';
import { StructureService } from '../structure.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-structure-details',
  templateUrl: './structure-details.component.html',
  styleUrls: ['./structure-details.component.scss']
})
export class StructureDetailsComponent implements OnInit {
  data: SubstanceStructure;

  constructor(
    private structureService: StructureService
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.structureService.getSafeStructureImgUrl(structureId, size);
  }

}
