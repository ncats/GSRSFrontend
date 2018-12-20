import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';

@Component({
  selector: 'app-substance-moieties',
  templateUrl: './substance-moieties.component.html',
  styleUrls: ['./substance-moieties.component.scss']
})
export class SubstanceMoietiesComponent extends SubstanceCardBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
