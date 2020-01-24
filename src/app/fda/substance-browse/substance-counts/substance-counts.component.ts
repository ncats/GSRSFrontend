import { Component, OnInit, Input } from '@angular/core';
import { SubstanceSummaryDynamicContent } from '@gsrs-core/substances-browse';
import { SubstanceDetail } from '@gsrs-core/substance';

@Component({
  selector: 'app-substance-counts',
  templateUrl: './substance-counts.component.html',
  styleUrls: ['./substance-counts.component.scss']
})
export class SubstanceCountsComponent implements OnInit, SubstanceSummaryDynamicContent {
  substance: SubstanceDetail;

  constructor() { }

  ngOnInit() {
    console.log(this.substance);
  }
}
