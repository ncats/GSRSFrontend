import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubstanceBrowseHeaderDynamicContent } from '@gsrs-core/substances-browse/substance-browse-header-dynamic-content.component';
import { GeneralService } from '../../service/general.service';
import { ConfigService } from '../../../core/config/config.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { take } from 'rxjs/operators';
import { LoadingService } from '@gsrs-core/loading';
import { MatDialog } from '@angular/material';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';

@Component({
  selector: 'app-show-application-toggle',
  templateUrl: './show-application-toggle.component.html',
  styleUrls: ['./show-application-toggle.component.scss']
})
export class ShowApplicationToggleComponent implements OnInit, AfterViewInit, SubstanceBrowseHeaderDynamicContent {
  test: any;
  isAdmin = false;
  displayMatchApplicationConfig = false;
  displayMatchAppCheckBoxValue = false;

  constructor(
    private generalService: GeneralService,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public loadingService: LoadingService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.isAdmin = this.authService.hasAnyRoles('Admin', 'SuperUpdater');
    this.isAdmin = true;
    alert('toggle: ' + this.isAdmin);
    if (this.isAdmin === true) {
      this.isDisplayAppToMatchConfig();
    }
  }

  ngAfterViewInit() {
    // put something;
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
            //   this.displayMatchAppCheckBoxValue = false;
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

  export() {

    /*
    if (this.etag) {
      const extension = 'xlsx';
      const url = this.getApiExportUrl(this.etag, extension);
      if (this.authService.getUser() !== '') {
        const dialogReference = this.dialog.open(ExportDialogComponent, {
          height: '215x',
          width: '550px',
          data: { 'extension': extension }
        });
        // this.overlayContainer.style.zIndex = '1002';
        const exportSub = dialogReference.afterClosed().subscribe(name => {
          // this.overlayContainer.style.zIndex = null;
          if (name && name !== '') {
            this.loadingService.setLoading(true);
            const fullname = name + '.' + extension;
            this.authService.startUserDownload(url, this.privateExport, fullname).subscribe(response => {
              this.loadingService.setLoading(false);
              this.loadingService.setLoading(false);
              const navigationExtras: NavigationExtras = {
                queryParams: {
                  totalSub: this.totalApplications
                }
              };
              const params = { 'total': this.totalApplications };
              this.router.navigate(['/user-downloads/', response.id]);
            }, error => this.loadingService.setLoading(false));
          }
        });
        this.subscriptions.push(exportSub);
      } else {
        this.disableExport = true;
      }
    }
    */
  }

  getApiExportUrl(etag: string, extension: string): string {
    return this.generalService.getApiExportUrl(etag, extension);
  }

}
