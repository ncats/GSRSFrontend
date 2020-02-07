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

@Component({
  selector: 'app-application-details-base',
  templateUrl: './application-details-base.component.html',
  styleUrls: ['./application-details-base.component.scss']
})
export class ApplicationDetailsBaseComponent implements OnInit {

  id : number;
  src: string;
  appType: string;
  appNumber: string;
  application: any;
  flagIconSrcPath: string;

  constructor(
    public applicationService: ApplicationService,
    public activatedRoute: ActivatedRoute,
    public loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.loadingService.setLoading(true);
    //this.id = this.activatedRoute.snapshot.params['id'];
    //this.src = this.activatedRoute.snapshot.params['src'];
   
    if (this.id > 0) {
      this.getApplicationDetails();
    } else {
      this.handleSubstanceRetrivalError();
    }

  }

  getApplicationDetails(): void {
    this.applicationService.getApplicationDetails(this.id, this.src).subscribe(response => {
      this.application = response;
      this.loadingService.setLoading(false);
    }, error => {
      this.handleSubstanceRetrivalError();
    });
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

}
