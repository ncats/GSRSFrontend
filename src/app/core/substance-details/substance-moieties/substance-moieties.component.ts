import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import {SubstanceDetail, SubstanceMoiety} from '../../substance/substance.model';
import { SafeUrl } from '@angular/platform-browser';
import {UtilsService} from '../../utils/utils.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-substance-moieties',
  templateUrl: './substance-moieties.component.html',
  styleUrls: ['./substance-moieties.component.scss']
})
export class SubstanceMoietiesComponent extends SubstanceCardBase implements OnInit {
  moieties: Array<SubstanceMoiety> = [];
  substanceUpdated = new Subject<SubstanceDetail>();

  constructor(
              private utilService: UtilsService
  ) {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null && this.substance.moieties != null) {
        this.moieties = this.substance.moieties;
      }
      this.countUpdate.emit(this.moieties.length);
    });
  }
}
