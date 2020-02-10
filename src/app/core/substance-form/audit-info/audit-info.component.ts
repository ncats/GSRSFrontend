import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-audit-info',
  templateUrl: './audit-info.component.html',
  styleUrls: ['./audit-info.component.scss']
})
export class AuditInfoComponent implements OnInit {
  @Input() source: any;
  constructor() { }

  ngOnInit() {

  }

}
