import { Component, OnInit, Input } from '@angular/core';
import { SubstanceSummaryDynamicContent } from '@gsrs-core/substances-browse';
import { SubstanceDetail } from '@gsrs-core/substance';
import { GeneralService } from '../../service/general.service';

@Component({
  selector: 'app-substance-counts',
  templateUrl: './substance-counts.component.html',
  styleUrls: ['./substance-counts.component.scss']
})
export class SubstanceCountsComponent implements OnInit, SubstanceSummaryDynamicContent {
  substance: SubstanceDetail;
  searchCount: any;

  constructor(private generalService: GeneralService) { }

  ngOnInit() {
   // console.log(this.substance);
    this.getSearchCount();
  }

  getSearchCount(): void {
    this.generalService.getSearchCount(this.substance.uuid).subscribe(searchCount => {
      this.searchCount = searchCount;
    });
  }

}
