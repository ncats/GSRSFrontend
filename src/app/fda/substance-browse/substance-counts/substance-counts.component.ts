import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacetParam } from '@gsrs-core/facets-manager';
import { SubstanceSummaryDynamicContent } from '@gsrs-core/substances-browse';
import { SubstanceDetail } from '@gsrs-core/substance';
import { GeneralService } from '../../service/general.service';
import { ConfigService } from '../../../core/config/config.service';
import { ApplicationService } from '../../application/service/application.service';
import { LoadedComponents } from '@gsrs-core/config';

@Component({
  selector: 'app-substance-counts',
  templateUrl: './substance-counts.component.html',
  styleUrls: ['./substance-counts.component.scss']
})
export class SubstanceCountsComponent implements OnInit, SubstanceSummaryDynamicContent {
  substanceNames: any;
  substanceKey: string;
  substance: SubstanceDetail;
  searchCount: any;
  appMatchListCount = 0;
  appMatchList: any;
  substanceId: string;
  fullFacetField = '';
  total = 0;
  privateSearch: string;
  privateFacetParams: FacetParam;
  pageSize = 0;
  isShowMatchList = 'false';
  // application: Application;
  displayMatchApplicationConfig = false;
  loadedComponents: LoadedComponents;
  appCountConcat = '0';

  constructor(
    private applicationService: ApplicationService,
    private generalService: GeneralService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private configService: ConfigService) { }

  ngOnInit() {
    this.substanceId = this.substance.uuid;
    this.loadedComponents = (this.configService.configData && this.configService.configData.loadedComponents) || null;
    if (this.loadedComponents && this.loadedComponents.applications) {
      this.getSearchCount();
      this.getAppIngredMatchListCount();
    }
    // Get Search Count for Application
    this.getApplicationBySubstanceKeyCenter();
  }

  getSubstanceKey() {
    if (this.substance) {
      // Get Substance Name
      // this.substanceName = this.substance._name;
      if (this.substance.codes.length > 0) {
        this.substance.codes.forEach(element => {
          if (element.codeSystem && element.codeSystem === 'BDNUM') {
            if (element.type && element.type === 'PRIMARY') {
              this.substanceKey = element.code;
            }
          }
        });
      }
    }
  }

  getSearchCount(): void {
    this.generalService.getSearchCount(this.substance.uuid).subscribe(searchCount => {
      if (searchCount) {
        this.searchCount = searchCount;
      }
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

  // GSRS 3.0
  getApplicationBySubstanceKeyCenter() {
    const skip = 5000;
    this.pageSize = 5000;
    this.privateSearch = this.applicationService.APPALL_SEARCH_SUBSTANCE_KEY + this.substanceKey;
    // + this.bdnum + ' AND root_center:' + this.center + ' AND root_fromTable: ' + this.fromTable;

    // this.privateSearch = "http://localhost:8083/api/v1/applicationsall/search?q=root_applicationProductList_applicationIngredientList_substanceKey:";

    // if (searchType && searchType === 'initial') {
    //    this.pageSize = 100;
    //  }
    const subscription = this.applicationService.getApplicationAll(
      'default',
      skip,
      this.pageSize,
      this.privateSearch,
      this.privateFacetParams
    ).subscribe(pagingResponse => {
      this.appCountConcat = pagingResponse.total.toString();
    }, error => {
      console.log('error');
    }, () => {
      subscription.unsubscribe();
    });
  }

  launchApplicationMatchingList(substanceId: string) {
    this.router.navigate(['/sub-app-match-list', substanceId]);
  }

}
