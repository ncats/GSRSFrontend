import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubstanceBrowseHeaderDynamicContent } from '@gsrs-core/substances-browse/substance-browse-header-dynamic-content.component';
import { GeneralService } from '../../service/general.service';
import { ConfigService } from '../../../core/config/config.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { take } from 'rxjs/operators';
import { LoadingService } from '@gsrs-core/loading';
import { MatDialog } from '@angular/material';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-application-toggle',
  templateUrl: './show-application-toggle.component.html',
  styleUrls: ['./show-application-toggle.component.scss']
})
export class ShowApplicationToggleComponent implements OnInit, AfterViewInit, OnDestroy, SubstanceBrowseHeaderDynamicContent {
  private subscriptions: Array<Subscription> = [];
  test: any;
  isAdmin = false;
  displayMatchApplicationConfig = false;
  displayMatchAppCheckBoxValue = false;
  etag = '';
  etagDetails: any;
  paramUrl = '';
  totalSubstance = 0;

  constructor(
    private generalService: GeneralService,
    private configService: ConfigService,
    private authService: AuthService,
    private substanceService: SubstanceService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public loadingService: LoadingService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.isAdmin = this.authService.hasAnyRoles('Admin', 'SuperUpdater');
    if (this.isAdmin === true) {
      this.isDisplayAppToMatchConfig();
    }

    // Get Etag and total from Browse Substance Results
    const subscriptionResult = this.substanceService.searchResults.subscribe(response => {
      if (response) {
        this.etag = response.etag;
        this.totalSubstance = response.total;
      }
    });
    this.subscriptions.push(subscriptionResult);
  }

  ngAfterViewInit() {
    // put something;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  isDisplayAppToMatchConfig(): void {
    if (this.configService.configData && this.configService.configData.displayMatchApplication !== null) {
      this.displayMatchApplicationConfig = JSON.parse(this.configService.configData.displayMatchApplication);

      // If the key 'displayMatchApplication' is set to true in conf.json file,
      // display the checkbox.
      if (this.displayMatchApplicationConfig === true) {
        const data = sessionStorage.getItem('matchAppCheckBoxValueSess');
        if (data === null) {
          sessionStorage.setItem('matchAppCheckBoxValueSess', 'false');
        } else {
          this.displayMatchAppCheckBoxValue = JSON.parse(data);
        }
      }
    }
  }

  setDisplayAppToMatchSession(checkBoxValue: any): void {
    sessionStorage.setItem('matchAppCheckBoxValueSess', checkBoxValue);

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/browse-substance']);
  }

  export(source: string) {
    if (this.etag) {
      const extension = 'xlsx';
      const url = this.getApiExportUrl(this.etag, extension);
     // if (this.authService.getUser() !== '') {
        const dialogReference = this.dialog.open(ExportDialogComponent, {
          height: '215x',
          width: '550px',
          data: { 'extension': extension }
        });
        dialogReference.afterClosed().subscribe(name => {
          if (name && name !== '') {
            this.loadingService.setLoading(true);
            const fullname = name + '.' + extension;
            this.generalService.getEtagDetails(this.etag, fullname, source).subscribe(response => {
              this.loadingService.setLoading(false);
              /*
              const navigationExtras: NavigationExtras = {
                queryParams: {
                  totalSub: this.totalApplications
                }
              };
              const params = { 'total': this.totalSubstance };
              */
              this.router.navigate(['/user-downloads/', response.id]);
            }, error => this.loadingService.setLoading(false));
          }
        });
   //   }
    }
  }

  getApiExportUrl(etag: string, extension: string): string {
    return this.generalService.getApiExportUrl(etag, extension);
  }

}
