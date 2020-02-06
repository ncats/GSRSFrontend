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
  public products: Array<any> = [];
  public displayedColumns: string[] = [
    'ndc',
    'name',
    'nonProprietaryName',
    'labelerName',
    'applicationNumber',
    'nameType',
    'ingredientType'
  ];

  constructor(
    public gaService: GoogleAnalyticsService,
    private productService: ProductService
  ) {
    super(gaService);
  }

  ngOnInit() {
    if (this.substance && this.substance.uuid) {
      this.getSubstanceProducts();
    }
  }

  getSubstanceProducts(): void {
    this.productService.getSubstanceProducts(this.substance.uuid).subscribe(products => {
      this.products = products;
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
