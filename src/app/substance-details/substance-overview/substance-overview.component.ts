import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';

@Component({
  selector: 'app-substance-overview',
  templateUrl: './substance-overview.component.html',
  styleUrls: ['./substance-overview.component.scss']
})
export class SubstanceOverviewComponent extends SubstanceCardBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
