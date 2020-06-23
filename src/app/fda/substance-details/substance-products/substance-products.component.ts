import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ProductService } from '../../product/service/product.service';
import { PageEvent } from '@angular/material/paginator';
import { SubstanceDetailsBaseTableDisplay } from './substance-details-base-table-display';
import { SubstanceAdverseEventCvmComponent } from './substance-adverseevent/adverseeventcvm/substance-adverseeventcvm.component';
import { ConfigService } from '@gsrs-core/config';

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

  public displayedColumns: string[] = [
    'productNDC',
    'name',
    'nonProprietaryName',
    'labelerName',
    'applicationNumber',
    'productNameType',
    'ingredientType'
  ];

  baseDomain: string;

  constructor(
    public gaService: GoogleAnalyticsService,
    private productService: ProductService,
    private configService: ConfigService
  ) {
    super(gaService, productService);
  }

  ngOnInit() {

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

    this.productService.getSubstanceProducts(this.substance.uuid, this.page, this.pageSize).subscribe(results => {
      this.setResultData(results);
      this.productCount = this.totalRecords;
    });
  }

  productListExportUrl() {
    if (this.substance && this.substance.uuid) {
      this.exportUrl = this.productService.getProductListExportUrl(this.substance.uuid);
    }
  }

}
