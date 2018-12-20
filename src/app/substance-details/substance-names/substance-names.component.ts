import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';

@Component({
  selector: 'app-substance-names',
  templateUrl: './substance-names.component.html',
  styleUrls: ['./substance-names.component.scss']
})
export class SubstanceNamesComponent extends SubstanceCardBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
