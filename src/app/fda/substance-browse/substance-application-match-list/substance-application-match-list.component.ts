import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../service/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '../../../core/utils/utils.service';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { AuthService } from '@gsrs-core/auth/auth.service';

@Component({
  selector: 'app-substance-application-match-list',
  templateUrl: './substance-application-match-list.component.html',
  styleUrls: ['./substance-application-match-list.component.scss']
})

export class SubstanceApplicationMatchListComponent implements OnInit {

  id: string;
  isAdmin: boolean;
  appMatchList: any;
  substanceNames: any;
  displayedColumns: string[] = ['Action', 'Application Type', 'Application Number', 'Status', 'Application Sub Type', 'Product Name', 'Bdnum', 'Exact Match'];
  dataSource = null;

  constructor(
    public generalService: GeneralService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
    private authService: AuthService) { }

  ngOnInit() {
    this.loadingService.setLoading(true);
    this.isAdmin = this.authService.hasAnyRoles('Admin', 'SuperUpdater');
    // this.isAdmin = true;
    if (this.isAdmin === true) {
      this.id = this.activatedRoute.snapshot.params['id'];
      if (this.id) {
        this.getApplicationIngredientMatchList(this.id);
        this.getSubstanceNames(this.id);
      }
    }
    this.loadingService.setLoading(false);

  }

  getApplicationIngredientMatchList(substanceId: string): void {
    this.generalService.getApplicationIngredientMatchList(substanceId).subscribe(appMatchList => {
      this.dataSource = appMatchList;
    });
  }

  getSubstanceNames(substanceId: string): void {
    this.generalService.getSubstanceNames(substanceId).subscribe(substanceNames => {
      this.substanceNames = substanceNames;
    });
  }

  autoUpdateApp(applicationId: string, bdnum: string): void {
    this.generalService.appIngredMatchListAutoUpdateSave(applicationId, bdnum).subscribe(update => {
    });
  }

}
