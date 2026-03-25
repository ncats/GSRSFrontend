import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';

@Component({
    selector: 'app-substance-audit-info',
    templateUrl: './substance-audit-info.component.html',
    styleUrls: ['./substance-audit-info.component.scss'],
    standalone: false
})
export class SubstanceAuditInfoComponent extends SubstanceCardBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
