import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';

@Component({
  selector: 'app-substance-subunits',
  templateUrl: './substance-subunits.component.html',
  styleUrls: ['./substance-subunits.component.scss']
})
export class SubstanceSubunitsComponent extends SubstanceCardBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
