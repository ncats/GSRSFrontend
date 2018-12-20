import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';

@Component({
  selector: 'app-substance-references',
  templateUrl: './substance-references.component.html',
  styleUrls: ['./substance-references.component.scss']
})
export class SubstanceReferencesComponent extends SubstanceCardBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
