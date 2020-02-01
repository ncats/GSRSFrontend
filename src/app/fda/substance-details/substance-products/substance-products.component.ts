import { Component, OnInit, ViewChild } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ProductService } from '../../product/service/product.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { SubstanceDetailsBaseTableDisplay } from './substance-details-base-table-display';

@Component({
  selector: 'app-substance-products',
  templateUrl: './substance-products.component.html',
  styleUrls: ['./substance-products.component.scss']
})

export class SubstanceProductsComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {
  
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
    private productService: ProductService
  ) {
    super(gaService, productService);
  }

  ngOnInit() {
    if (this.substance && this.substance.uuid) {
      //Get Bdnum
      this.getBdnum();
      
      //Get Product Data based on substance uuid
      this.getSubstanceProducts();
    }
  }

  getBdnum() {
    if (this.substance) {
      if (this.substance.codes.length > 0) {
          this.substance.codes.forEach(element => {
            if (element.codeSystem && element.codeSystem == "BDNUM") {
              if (element.type && element.type == "PRIMARY") {
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
    });
  }
   
}
