import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubstanceSummaryDynamicContent } from '@gsrs-core/substances-browse';
import { SubstanceDetail } from '@gsrs-core/substance';
import { GeneralService } from '../../service/general.service';
import { ConfigService } from '../../../core/config/config.service';

@Component({
  selector: 'app-substance-counts',
  templateUrl: './substance-counts.component.html',
  styleUrls: ['./substance-counts.component.scss']
})
export class SubstanceCountsComponent implements OnInit, SubstanceSummaryDynamicContent {
  substance: SubstanceDetail;
  searchCount: any;
  appMatchListCount: 0;
  appMatchList: any;
  substanceId: string;
  displayMatchApplicationConfig = false;

  constructor(
    private generalService: GeneralService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private configService: ConfigService) { }

  ngOnInit() {
    this.substanceId = this.substance.uuid;
    this.getSearchCount();
    this.getAppIngredMatchListCount();
  }

  getSearchCount(): void {
    this.generalService.getSearchCount(this.substance.uuid).subscribe(searchCount => {
      this.searchCount = searchCount;
    });
  }

  // Application Match Lists functions
  getAppIngredMatchListCount(): void {
    const data = sessionStorage.getItem('matchAppCheckBoxValueSess');
    if ((data !== null) && (data === 'true')) {
      this.generalService.getAppIngredtMatchListCount(this.substance.uuid).subscribe(appMatchCount => {
        this.appMatchListCount = appMatchCount.total;
      });
    }
  }

}
