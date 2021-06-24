import { Component, OnInit, AfterViewInit } from '@angular/core';
import { GeneralService } from '../../service/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { UtilsService } from '../../../core/utils/utils.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ApplicationService } from '../../application/service/application.service';
import { Subscription } from 'rxjs';
import { Application, ApplicationIngredient } from '../../application/model/application.model';

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
  displayedColumns: string[] = ['Num', 'Action', 'Application Type', 'Application Number', 'Status', 'Application Sub Type', 'Product Name', 'Application Bdnum', 'Exact Match'];
  dataSource = null;
  updated = 'false';
  autoUpdateSavedSuccess = false;
  private subscriptions: Array<Subscription> = [];
  application: Application;
  preferredTerm = '';

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
      this.getApplicationIngredientMatchList(this.id);
      this.getSubstanceNames(this.id);
    }
    this.loadingService.setLoading(false);
  }

  ngAfterViewInit() {
  }

  getApplicationIngredientMatchList(substanceId: string): void {
    this.generalService.getApplicationIngredientMatchList(substanceId).subscribe(appMatchList => {
      this.dataSource = appMatchList;
    });
  }

  getSubstanceNames(substanceId: string): void {
    this.generalService.getSubstanceNamesBySubstanceUuid(substanceId).subscribe(substanceNames => {
      this.substanceNames = substanceNames;

      // Get Preferred Term or DisplayName == true
      this.substanceNames.forEach((names) => {
        if (names.displayName === true) {
          this.preferredTerm = names.name;
        }
      });
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
              if (elementIngred.bdnum === null) {
                elementIngred.bdnum = bdnum;
                elementIngred.basisOfStrengthBdnum = bdnum;
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
