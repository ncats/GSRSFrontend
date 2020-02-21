import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ProductService } from '../../product/service/product.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { SubstanceDetailsBaseTableDisplay } from './substance-details-base-table-display';
import { SubstanceAdverseEventCvmComponent } from './substance-adverseevent/adverseeventcvm/substance-adverseeventcvm.component';
import { AuthService } from '@gsrs-core/auth';

@Component({
  selector: 'app-substance-products',
  templateUrl: './substance-products.component.html',
  styleUrls: ['./substance-products.component.scss'],
  encapsulation: ViewEncapsulation.None
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

  constructor(
    public gaService: GoogleAnalyticsService,
    private productService: ProductService,
    public authService: AuthService
  ) {
    super(gaService, productService, authService);
  }

  ngOnInit() {
    this.isAdmin = this.authService.hasAnyRoles('Updater', 'SuperUpdater');

    this.isAdmin = true;

    if (this.substance && this.substance.uuid) {
      // Get Bdnum
      this.getBdnum();

      // Get Product Data based on substance uuid
      this.getSubstanceProducts();
    }
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
      this.productCount = results.length;
    });
  }

}
