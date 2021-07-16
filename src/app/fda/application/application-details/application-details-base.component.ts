import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { LoadingService } from '@gsrs-core/loading';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../core/utils/utils.service';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ApplicationService } from '../service/application.service';
import { GeneralService } from '../../service/general.service';

@Component({
  selector: 'app-application-details-base',
  templateUrl: './application-details-base.component.html',
  styleUrls: ['./application-details-base.component.scss']
})
export class ApplicationDetailsBaseComponent implements OnInit {

  id: number;
  src: string;
  appType: string;
  appNumber: string;
  application: any;
  flagIconSrcPath: string;
  isAdmin = false;
  updateApplicationUrl: string;
  message = '';
  subscriptions: Array<Subscription> = [];

  constructor(
    public applicationService: ApplicationService,
    public generalService: GeneralService,
    public activatedRoute: ActivatedRoute,
    public loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
    // private authService: AuthService,
  ) { }

  ngOnInit() {
    this.loadingService.setLoading(true);
    if (this.id) {
      if (this.isNumber(this.id) === true) {
        this.getApplicationDetails();
      } else {
        this.message = 'The application Id in url should be a number';
      }
    } else {
      this.handleSubstanceRetrivalError();
    }
    this.loadingService.setLoading(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getApplicationDetails(): void {
    this.applicationService.getApplicationById(this.id).subscribe(response => {
      this.application = response;
      if (Object.keys(this.application).length > 0) {
        this.getSubstanceBySubstanceKey();
      }
    }, error => {
    //  this.message = 'No Application record found';
     // this.handleSubstanceRetrivalError();
    });
  }

  getSubstanceBySubstanceKey() {
    if (this.application != null) {
      this.application.applicationProductList.forEach(elementProd => {
        if (elementProd != null) {
          elementProd.applicationIngredientList.forEach(elementIngred => {
            if (elementIngred != null) {
              // Get Substance Details, uuid, approval_id, substance name
              if (elementIngred.substanceKey) {
                const ingSubscription = this.generalService.getSubstanceByAnyId(elementIngred.substanceKey).subscribe(response => {
                  if (response) {
                    elementIngred._substanceUuid = response.uuid;
                    elementIngred._ingredientName = response._name;
                  }
                });
                this.subscriptions.push(ingSubscription);
              }

              // Get Basis of Strength
              if (elementIngred.basisOfStrengthSubstanceKey) {
                const basisSubscription = this.generalService.getSubstanceByAnyId(elementIngred.basisOfStrengthSubstanceKey).subscribe(response => {
                  if (response) {
                    elementIngred._basisOfStrengthSubstanceUuid = response.uuid;
                    elementIngred._basisOfStrengthIngredientName = response._name;
                  }
                });
                this.subscriptions.push(basisSubscription);
              }
            }
          });
        }
      });
    }
  }

  isNumber(str: any): boolean {
    if (str) {
      const num = Number(str);
      const nan = isNaN(num);
      return !nan;
    }
    return false;
  }

  public handleSubstanceRetrivalError() {
    this.loadingService.setLoading(false);
    const notification: AppNotification = {
      message: 'The web address above is incorrect. You\'re being forwarded to Browse Substances',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
     // this.router.navigate(['/browse-substance']);
    }, 5000);

  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size, true);
  }
}
