import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
    selector: 'app-audit-info',
    templateUrl: './audit-info.component.html',
    styleUrls: ['./audit-info.component.scss'],
    standalone: true,
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditInfoComponent implements OnInit {
  @Input() source: any;
  constructor() { }

  ngOnInit() {

  }

}
