import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubstanceSummaryDynamicContent } from '@gsrs-core/substances-browse';
import { SubstanceDetail } from '@gsrs-core/substance';
import { GeneralService } from '../../service/general.service';
import { ConfigService } from '../../../core/config/config.service';
import { ApplicationService } from '../../application/service/application.service';

@Component({
  selector: 'app-substance-counts',
  templateUrl: './substance-counts.component.html',
  styleUrls: ['./substance-counts.component.scss']
})
export class SubstanceCountsComponent implements OnInit, SubstanceSummaryDynamicContent {
  substanceNames: any;
  substance: SubstanceDetail;
  searchCount: any;
  appMatchListCount = 0;
  appMatchList: any;
  substanceId: string;
  fullFacetField = '';
  total = 0;
  isShowMatchList = 'false';
  // application: Application;
  displayMatchApplicationConfig = false;

  constructor(
    private applicationService: ApplicationService,
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
    this.isShowMatchList = sessionStorage.getItem('matchAppCheckBoxValueSess');
    if ((this.isShowMatchList !== null) && (this.isShowMatchList === 'true')) {
      this.getSubstanceNames(this.substance.uuid);
      //    this.generalService.getAppIngredtMatchListCount(this.substance.uuid).subscribe(response => {
      //      this.appMatchListCount = response.count;
      //     });
    }
  }

  getSubstanceNames(substanceId: string): void {
    if (substanceId) {
      this.generalService.getSubstanceNamesBySubstanceUuid(substanceId).subscribe(substanceNames => {
        this.substanceNames = substanceNames;

        // Get Preferred Term or DisplayName == true
        this.substanceNames.forEach((names, index) => {
          if (names.displayName === true) {
            //   this.preferredTerm = names.name;
          }
          const facetField = 'root_applicationProductList_applicationProductNameList_productName:';
          if (names) {
            if (names.name) {
              if (index > 0) {
                this.fullFacetField = this.fullFacetField + ' OR ';
              }
              this.fullFacetField = this.fullFacetField + facetField + "\"" + names.name + "\"";
            }
          }
        });
        this.getApplicationIngredientMatchList();
      });
    }
  }

  getApplicationIngredientMatchList(): void {
    // Facet Search for "Has No Ingredient"
    const facetParam = { 'Has Ingredients': { 'params': { 'Has No Ingredient': true }, 'isAllMatch': false } };

    const subscription = this.applicationService.getApplications(
      null,
      0,
      200,
      this.fullFacetField,
      facetParam
    )
      .subscribe(pagingResponse => {
        this.appMatchListCount = pagingResponse.count;
      });
  }

}
