import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GeneralService } from '../../service/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { UtilsService } from '../../../core/utils/utils.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ApplicationService } from '../../application/service/application.service';
import { Subscription } from 'rxjs';
import { Application, SubstanceApplicationMatch } from '../../application/model/application.model';

@Component({
  selector: 'app-substance-application-match-list',
  templateUrl: './substance-application-match-list.component.html',
  styleUrls: ['./substance-application-match-list.component.scss']
})

export class SubstanceApplicationMatchListComponent implements OnInit, AfterViewInit {

  id: string;
  isAdmin = false;
  appMatchList: any;
  substanceNames: any;
  displayedColumns: string[] = ['Num', 'Action', 'Application Type', 'Application Number', 'Status', 'Application Sub Type', 'Product Name', 'Application Substance Key', 'Exact Match'];
  dataSource = null;
  updated = 'false';
  autoUpdateSavedSuccess = false;
  private subscriptions: Array<Subscription> = [];
  applications: Array<Application>;
  substanceApplicationMatchList: Array<SubstanceApplicationMatch> = [];
  preferredTerm = '';
  fullFacetField = '';
  total = 0;
  application: Application;

  constructor(
    public generalService: GeneralService,
    private applicationService: ApplicationService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public loadingService: LoadingService,
    private utilsService: UtilsService,
    private authService: AuthService) { }

  ngOnInit() {
    this.loadingService.setLoading(true);
    this.authService.hasRolesAsync('Admin').subscribe(response => {
      this.isAdmin = response;
    });

    this.id = this.activatedRoute.snapshot.params['id'];

    if (this.id) {
      this.getSubstanceNames(this.id);
    }
    this.loadingService.setLoading(false);
  }

  ngAfterViewInit() {
  }

  getSubstanceNames(substanceId: string): void {
    this.generalService.getSubstanceNamesBySubstanceUuid(substanceId).subscribe(substanceNames => {
      this.substanceNames = substanceNames;

      // Get Preferred Term or DisplayName == true
      this.substanceNames.forEach((names, index) => {
        if (names.displayName === true) {
          this.preferredTerm = names.name;
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
        this.applications = pagingResponse.content;
        this.total = pagingResponse.count;
        if (this.applications.length > 0) {
          this.applications.forEach((application, index) => {
            if (application) {

              // Create object locally to display selected columns in tabular format into the table
              const matchObject: SubstanceApplicationMatch = {};
              matchObject.id = application.id;
              matchObject.appType = application.appType;
              matchObject.appNumber = application.appNumber;
              matchObject.status = application.status;
              matchObject.appSubType = application.appSubType;

              let productName = '';
              let bdnum = '';
              const newline = ' || ';
              let exactMatchName = '';
              let exactMatchBdnum = '';

              // Product
              application.applicationProductList.forEach((elementProd, indexProd) => {

                // Need to think about this
                let bdnum = '';

                // Product Name
                elementProd.applicationProductNameList.forEach((elementProdName, indexProdName) => {
                  if (elementProdName) {
                    if (indexProdName > 0) {
                      productName = productName + newline;
                    }
                    productName = productName + elementProdName.productName;

                    // look for if Substance Name and Product Name have Exact Match
                    this.substanceNames.forEach((names, indexNames) => {
                      if (names) {
                        if (names.name) {
                          if (elementProdName.productName) {
                            if (names.name === elementProdName.productName.trim()) {
                              exactMatchName = names.name;

                              // Get Substance Key for the Name
                              this.generalService.getSubstanceCodesBySubstanceUuid(this.id).subscribe(response => {
                                if (response) {
                                  const substanceCodes = response;
                                  for (let index = 0; index < substanceCodes.length; index++) {
                                    if (substanceCodes[index].codeSystem) {
                                      if ((substanceCodes[index].codeSystem === this.generalService.getSubstanceKeyType()) &&
                                        (substanceCodes[index].type === 'PRIMARY')) {
                                        exactMatchBdnum = substanceCodes[index].code;
                                        matchObject.exactMatchName = exactMatchName;

                                      }
                                    }
                                  }
                                }
                              });
                            }
                          }
                        }
                      }
                    });
                  }
                });

                // Ingredient
                elementProd.applicationIngredientList.forEach((elementIngred, indexIngred) => {
                  if (elementIngred) {
                    if (elementIngred.substanceKey) {
                      if (indexIngred > 0) {
                        bdnum = bdnum + '|';
                      }
                      bdnum = bdnum + elementIngred.substanceKey;
                    } else {
                      bdnum = bdnum + '(No Substance Key)';
                    }
                  } else {
                    bdnum = bdnum + '(No Substance Key)';
                  }
                }); // Ingredient forEach

                matchObject.productName = productName;
                matchObject.exactMatchName = exactMatchName;
            //    matchObject.exactMatchBdnum = exactMatchBdnum;
                matchObject.bdnum = bdnum;

              //  alert('later ' + exactMatchBdnum);

              }); // Product forEach


              this.substanceApplicationMatchList.push(matchObject);
            }
          }); // Application forEach

          this.dataSource = this.substanceApplicationMatchList;
        }
      });
  }

  autoUpdateApp(index: number, applicationId: number, bdnum: string): void {
    this.loadingService.setLoading(true);
    this.dataSource[index].autoUpdateMessage = 'Saving....Please wait.';
    this.dataSource[index].isDisableButton = true;
    this.applicationService.getApplicationById(applicationId).subscribe(response => {
      if (response) {
        this.application = response;
        if (this.application) {
          this.application.applicationProductList.forEach((elementProd, indexProd) => {
            elementProd.applicationIngredientList.forEach((elementIngred, indexIngred) => {
              if (!elementIngred.substanceKey) {
                elementIngred.substanceKey = bdnum;
                elementIngred.basisOfStrengthSubstanceKeyType = this.generalService.getSubstanceKeyType();
                elementIngred.basisOfStrengthSubstanceKey = bdnum;
                elementIngred.basisOfStrengthSubstanceKeyType = this.generalService.getSubstanceKeyType();
                elementIngred.ingredientType = 'Active Ingredient';
                elementIngred.applicantIngredName = this.preferredTerm;

                this.applicationService.application = this.application;
                this.applicationService.saveApplication().subscribe(responseSaved => {
                  const savedApp = responseSaved;
                  alert('The Auto Update saved the application record successfully');
                  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                  this.router.onSameUrlNavigation = 'reload';
                  this.router.navigate(['/sub-app-match-list', this.id]);
                });
              }
            });
          });
        }
      }
    });
    this.loadingService.setLoading(false);
  }

}
