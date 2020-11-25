import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ProductService } from '../../product/service/product.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { SubstanceDetailsBaseTableDisplay } from './substance-details-base-table-display';
import { SubstanceAdverseEventCvmComponent } from './substance-adverseevent/adverseeventcvm/substance-adverseeventcvm.component';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth';

@Component({
  selector: 'app-substance-products',
  templateUrl: './substance-products.component.html',
  styleUrls: ['./substance-products.component.scss']
})

export class SubstanceProductsComponent extends SubstanceDetailsBaseTableDisplay implements OnInit, AfterViewInit {

  productCount = 0;
  applicationCount = 0;
  clinicalTrialCount = 0;
  clinicalTrialEuCount = 0;
  advPtCount = 0;
  advDmeCount = 0;
  advCvmCount = 0;

  datasourceList = '';
  country = 'USA';
  fromTable = '';
  loadingStatus = '';
  showSpinner = false;

  public displayedColumns: string[] = [
    'productNDC',
  //  'name',
    'nonProprietaryName',
    'status',
  //  'labelerName',
    'productNameType',
   // 'ingredientType'
   'routeAdmin',
   'country',
   'applicationNumber',
  ];

  baseDomain: string;

  public countryList = ['USA', 'Canada'];

  constructor(
    public gaService: GoogleAnalyticsService,
    private productService: ProductService,
    private configService: ConfigService,
    public authService: AuthService
  ) {
    super(gaService, productService);
  }

  ngOnInit() {
    this.isAdmin = this.authService.hasAnyRoles('Admin', 'Updater', 'SuperUpdater');

    if (this.substance && this.substance.uuid) {
      // Get Bdnum
      this.getBdnum();

      // Get Product Data based on substance uuid
      this.getSubstanceProducts();
      this.productListExportUrl();
    }

    this.baseDomain = this.configService.configData.apiUrlDomain;
  }

  ngAfterViewInit() {
  }

  getApplicationCount($event: any) {
    this.applicationCount = $event;
  }

  getClinicalTrialCount($event: any) {
    this.clinicalTrialCount = $event;
  }

  getClinicalTrialEuCount($event: any) {
    this.clinicalTrialEuCount = $event;
  }

  getAdvPtCount($event: any) {
    this.advPtCount = $event;
  }

  getAdvDmeCount($event: any) {
    this.advDmeCount = $event;
  }

  getAdvCvmCount($event: any) {
    this.advCvmCount = $event;
  }

  getBdnum() {
    if (this.substance) {
      if (this.substance.codes.length > 0) {
        this.substance.codes.forEach(element => {
          if (element.codeSystem && element.codeSystem === 'BDNUM') {
            if (element.type && element.type === 'PRIMARY') {
              this.bdnum = element.code;
            }
          }
        });
      }
    }
  }

  getSubstanceProducts(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);
    this.showSpinner = true;  // Start progress spinner
    this.productService.getSubstanceProducts(this.substance.uuid, this.country, this.page, this.pageSize).subscribe(results => {
      this.setResultData(results);
      this.productCount = this.totalRecords;
      this.loadingStatus = '';
      this.showSpinner = false;  // Stop progress spinner
    });
  }

  productListExportUrl() {
    if (this.substance && this.substance.uuid) {
      this.exportUrl = this.productService.getProductListExportUrl(this.substance.uuid);
    }
  }

  tabSelected($event) {
    if ($event) {
      const evt: any = $event.tab;
      const textLabel: string = evt.textLabel;
      // Get Country and fromTable/Source from Tab Label
      if (textLabel != null) {
        this.loadingStatus = 'Loading data...';
        const index = textLabel.indexOf(' ');
        const tab = textLabel.slice(0, index);
        this.country = textLabel.slice(index + 1, textLabel.length);
        // set the current result data to empty or null.
        this.paged = [];

        this.getSubstanceProducts();

      }

    }
  }


}
