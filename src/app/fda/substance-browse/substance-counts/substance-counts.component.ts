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
  appMatchListCount: any;
  appMatchList: any;
  substanceId: string;
  displayMatchApplicationConfig = false;
  displayMatchApplicationBool: false;
  displayMatchApplicationSession: false;

  constructor(
    private generalService: GeneralService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private configService: ConfigService, ) { }

  ngOnInit() {
    /*
    this.displayMatchApplicationConfig = this.configService.configData && this.configService.configData.displayMatchApplication;
    if (this.displayMatchApplicationConfig) {
      this.displayMatchApplicationBool = JSON.parse(this.displayMatchApplicationConfig);
    }
    */
    this.substanceId = this.substance.uuid;
    this.isDisplayAppToMatchConfig();
    this.getSearchCount();
    this.getAppIngredtMatchListCount();
  }

  getSearchCount(): void {
    this.generalService.getSearchCount(this.substance.uuid).subscribe(searchCount => {
      this.searchCount = searchCount;
    });
  }

  // Application Match Lists functions
  isDisplayAppToMatchConfig(): void {
    this.generalService.isDisplayAppToMatchConfig().subscribe(result => {
      alert(result.isDisplay);
      this.displayMatchApplicationConfig = result.isDisplay;
    });
  }

  getAppIngredtMatchListCount(): void {
    this.generalService.getAppIngredtMatchListCount(this.substance.uuid).subscribe(appMatchCount => {
      this.appMatchListCount = appMatchCount.total;
    });
  }

  getApplicationIngredientMatchList(substanceId: string): void {
    if (substanceId) {
      this.router.navigate(['/sub-app-match-list', substanceId]);
    }
  }

  updateCheckBox(): void {
    alert('CHECK');
  }
}
