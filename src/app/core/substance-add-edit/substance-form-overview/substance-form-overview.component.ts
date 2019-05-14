import { Component, OnInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';

@Component({
  selector: 'app-substance-form-overview',
  templateUrl: './substance-form-overview.component.html',
  styleUrls: ['./substance-form-overview.component.scss']
})
export class SubstanceFormOverviewComponent extends SubstanceFormSectionBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
