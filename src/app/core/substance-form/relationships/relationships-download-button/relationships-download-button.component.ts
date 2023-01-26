import { Component, OnInit, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { SubstanceBrowseHeaderDynamicContent } from '@gsrs-core/substances-browse/substance-browse-header-dynamic-content.component';
// import { GeneralService } from '../../service/general.service';
import { ConfigService } from '@gsrs-core/config/config.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { take } from 'rxjs/operators';
import { LoadingService } from '@gsrs-core/loading';
import { MatDialog } from '@angular/material/dialog';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
import { Subscription } from 'rxjs';
import {Subject} from 'rxjs';
import {SubstanceDetail, SubstanceRelationship} from '@gsrs-core/substance/substance.model';


@Component({
  selector: 'app-relationships-download-button',
  templateUrl: './relationships-download-button.component.html',
  styleUrls: ['./relationships-download-button.component.scss']
})
export class RelationshipsDownloadButtonComponent implements OnInit, AfterViewInit, OnDestroy, SubstanceBrowseHeaderDynamicContent {
  private subscriptions: Array<Subscription> = [];
  test: any;
  isAdmin = false;
  privateExport = false;
  etag = '';
  etagDetails: any;
  paramUrl = '';
  totalSubstance = 0;
  loadedComponents: any;
  exportOptions: Array<any>;
  hasAdditionalDownloads = false;
  additionalExportOptions = [];

  constructor(
    // private generalService: GeneralService,
    private configService: ConfigService,
    private authService: AuthService,
    private substanceService: SubstanceService,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public loadingService: LoadingService,
    private dialog: MatDialog) { }

    // @Input() substance: Subject<SubstanceDetail>; // parent class uses this object but vscode complains.
    @Input() substance: any;


  ngOnInit() {

    this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').pipe(take(1)).subscribe(response => {
      this.isAdmin = response;

      if (this.isAdmin === true) {
      }
    });
    this.loadedComponents = (this.configService.configData && this.configService.configData.loadedComponents) || null;
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

  export(source: string) {

    // Do this first subscription here to avoid unecessary searches on init
    const subscriptionResult = this.substanceService.searchFromString(
      'q=root_uuid:"^' +  this.substance.uuid + '$"')
      .subscribe(response => {
      if (response) {
        this.etag = response.etag;
        this.totalSubstance = response.total;
        console.log("awd here3 " + this.etag);    
      }

      if (this.etag) {
        const extension = 'relationships.txt';
        const url = this.getApiExportUrl(this.etag, extension, source);
        console.log("awd url "+ url);
        if (this.isAdmin === true) {
          let type = '';
          if (source != null) {
            if (source === 'relationships') {
              type = 'export';
            }
          }
          const dialogReference = this.dialog.open(ExportDialogComponent, {
            // height: '215x',
            width: '700px',
            data: { 'extension': extension, 'type': type, 'entity': 'substances', 'hideOptionButtons': true }
          });
          dialogReference.afterClosed().subscribe(response => {
            const name = response.name;
            const id = response.id;
            console.log("awd id configId? " + id);
            if (name && name !== '') {
              this.loadingService.setLoading(true);
              const fullname = name + '.' + extension;
              this.authService.startUserDownload(url, this.privateExport, fullname, id).subscribe(response => {
                this.loadingService.setLoading(false);
                const navigationExtras: NavigationExtras = {
                  queryParams: {
                  }
                };
                this.router.navigate(['/user-downloads/', response.id]);
              }, error => this.loadingService.setLoading(false));
            }
          });
        }
      } // if etag
    });
    this.subscriptions.push(subscriptionResult);
  }

  getApiExportUrl(etag: string, extension: string, source: string): string {
        return `${this.configService.configData.apiBaseUrl}api/v1/substances/export/${etag}/${extension}`;
  }

}
