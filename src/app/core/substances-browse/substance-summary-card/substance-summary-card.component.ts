import { Component, OnInit, Input } from '@angular/core';
import { SubstanceDetail } from '../../substance/substance.model';

@Component({
  selector: 'app-substance-summary-card',
  templateUrl: './substance-summary-card.component.html',
  styleUrls: ['./substance-summary-card.component.scss']
})
export class SubstanceSummaryCardComponent implements OnInit {
  @Input()
  substance: SubstanceDetail;

  constructor() { }

  ngOnInit() {
  }

}
