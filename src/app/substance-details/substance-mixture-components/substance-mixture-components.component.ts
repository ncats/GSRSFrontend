import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import { MixtureComponents } from '../../substance/substance.model';
import { SafeUrl} from '@angular/platform-browser';
import {UtilsService} from '../../utils/utils.service';

@Component({
  selector: 'app-substance-mixture-components',
  templateUrl: './substance-mixture-components.component.html',
  styleUrls: ['./substance-mixture-components.component.scss']
})
export class SubstanceMixtureComponentsComponent extends SubstanceCardBase implements OnInit {
  components: Array<MixtureComponents>;
  required: Array<MixtureComponents>;
  presentInAny: Array<MixtureComponents>;
  presentInOne: Array<MixtureComponents>;


  constructor(
    private utilsService: UtilsService,
  ) {
    super();
  }

  ngOnInit() {
    if ((this.substance != null) && (this.substance.mixture.components.length > 0)) {
      this.components = this.substance.mixture.components;
      this.required = this.components.filter(
        component => component.type === 'MUST_BE_PRESENT');
      this.presentInAny = this.components.filter(
        component => component.type === 'MAY_BE_PRESENT_ANY_OF');
      this.presentInOne = this.components.filter(
        component => component.type === 'MAY_BE_PRESENT_ONE_OF');
    }
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size);
  }


}
