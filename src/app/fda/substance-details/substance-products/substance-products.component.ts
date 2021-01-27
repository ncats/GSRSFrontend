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
import { take } from 'rxjs/operators';

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
  impuritiesCount = 0;
  provenance = '';
  provenanceList = '';
  datasourceList = '';
  loadingStatus = '';
  showSpinner = false;
  baseDomain: string;
  foundProvenanceList = false;
  loadingComplete = false;

  public displayedColumns: string[] = [
    'productNDC',
    //  'name',
    'productName',
    'labelerName',
    'country',
    'status',
    'productNameType',
    'ingredientType',
    'activeMoiety',
    'applicationNumber',
  ];

  constructor(
    public gaService: GoogleAnalyticsService,
    private productService: ProductService,
    private configService: ConfigService,
    public authService: AuthService
  ) {
    super(gaService, productService);
  }

  ngOnInit() {

    this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').pipe(take(1)).subscribe(response => {
      this.isAdmin = response;
    });

    if (this.substance && this.substance.uuid) {
      this.getBdnum();
      // Get Provenance List to Display in Tab
      this.getProductProvenanceList();
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

  getImpuritiesCount($event: any) {
    this.impuritiesCount = $event;
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

  getProductProvenanceList(): void {
    this.productService.getProductProvenanceList(this.substance.uuid).subscribe(results => {
      this.provenanceList = results.provenanceList;
      if (this.provenanceList.length > 0) {
        this.foundProvenanceList = true;
      }
      this.loadingComplete = true;
    });
  }

  getSubstanceProducts(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);
    this.showSpinner = true;  // Start progress spinner
    this.productService.getSubstanceProducts(this.substance.uuid, this.provenance, this.page, this.pageSize).subscribe(results => {
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
        this.provenance = textLabel;
        //  const index = textLabel.indexOf(' ');
        //  const tab = textLabel.slice(0, index);
        // this.country = textLabel.slice(index + 1, textLabel.length);
        // set the current result data to empty or null.
        this.paged = [];

        this.getSubstanceProducts();

      }

    }
  }


}
