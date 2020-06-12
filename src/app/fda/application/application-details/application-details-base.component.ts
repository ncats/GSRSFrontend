import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../service/application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../core/utils/utils.service';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
// import { AuthService } from '@gsrs-core/auth/auth.service';

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

  constructor(
    public applicationService: ApplicationService,
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
        this.loadingService.setLoading(false);
      }
    } else {
      this.handleSubstanceRetrivalError();
    }
  }

  getApplicationDetails(): void {
    this.applicationService.getApplicationDetails(this.id).subscribe(response => {
      this.application = response;
      if (Object.keys(this.application).length > 0) {
        this.getSubstanceDetails();
      }
      this.loadingService.setLoading(false);
    }, error => {
      this.handleSubstanceRetrivalError();
    });
  }

  getSubstanceDetails() {
    if (this.application != null) {
      this.application.applicationProductList.forEach(elementProd => {
        if (elementProd != null) {
          elementProd.applicationIngredientList.forEach(elementIngred => {
            if (elementIngred != null) {
              // Get Ingredient Name
              if (elementIngred.bdnum) {
                this.applicationService.getSubstanceDetailsByBdnum(elementIngred.bdnum).subscribe(response => {
                  if (response) {
                    if (response.substanceId) {
                      elementIngred.substanceId = response.substanceId;
                      elementIngred.ingredientName = response.name;
                    }
                  }
                });
              }

              // Get Basis of Strength
              if (elementIngred.basisOfStrengthBdnum) {
                this.applicationService.getSubstanceDetailsByBdnum(elementIngred.basisOfStrengthBdnum).subscribe(response => {
                  if (response) {
                    if (response.substanceId) {
                      elementIngred.basisOfStrengthSubstanceId = response.substanceId;
                      elementIngred.basisOfStrengthIngredientName = response.name;
                    }
                  }
                });
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
      this.router.navigate(['/browse-substance']);
    }, 5000);

  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size, true);
  }
}
