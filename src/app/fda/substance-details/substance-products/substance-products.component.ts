import { Component, OnInit } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ProductService } from '../../product/product.service';

@Component({
  selector: 'app-substance-products',
  templateUrl: './substance-products.component.html',
  styleUrls: ['./substance-products.component.scss']
})
export class SubstanceProductsComponent extends SubstanceCardBaseFilteredList<any> implements OnInit {
  
  public bdnum;
  public products: Array<any> = [];
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
    super(gaService);
  }

  ngOnInit() {

    // Get Bdnum
    this.getBdnum();

    if (this.substance && this.substance.uuid) {
      this.getSubstanceProducts();
    }
  }

  getBdnum() {
    if (this.substance) {
      if (this.substance.codes.length > 0) {
          this.substance.codes.forEach(element => {
            if (element.codeSystem && element.codeSystem == "BDNUM") {
              if (element.type && element.type == "PRIMARY") {
                console.log("BDNUM: " + element.code + "    " + element.type);  
                this.bdnum = element.code;
              }       
            }
          });
      }
    }
  }

  getSubstanceProducts(): void {
    console.log("IN PROD BDNUM: " + this.bdnum);
    this.productService.getSubstanceProducts(this.substance.uuid).subscribe(products => {
      this.products = products;
       console.log("product Length: " + products.length);
      this.filtered = products;
      this.pageChange();

      this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.products, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.countUpdate.emit(products.length);
    });
  }

}
