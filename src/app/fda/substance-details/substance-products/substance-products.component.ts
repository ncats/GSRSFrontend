import { Component, OnInit, ViewChild } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ProductService } from '../../product/product.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-substance-products',
  templateUrl: './substance-products.component.html',
  styleUrls: ['./substance-products.component.scss']
})
export class SubstanceProductsComponent extends SubstanceCardBaseFilteredList<any> implements OnInit {
  
  //private dataSource: any = new MatTableDataSource<any>();
  //myDataSource: any;   
  
  public filteredData: Array<any> = [];
  totalRecords: 0;
  public bdnum;
  public products: Array<any> = [];
  //public results: Array<any> = [];
  
  public displayedColumns: string[] = [
    'productNDC',
    'name',
    'nonProprietaryName',
    'labelerName',
    'applicationNumber',
    'productNameType',
    'ingredientType'
  ];

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  //ngAfterViewInit() {
    //this.myDataSource.paginator = this.paginator;
  //}

  constructor(
    public gaService: GoogleAnalyticsService,
    private productService: ProductService
  ) {
    super(gaService);
  }

  ngOnInit() {

    if (this.substance && this.substance.uuid) {
      //Get Bdnum
      this.getBdnum();
      
      //Get Product Data based on substance uuid
      this.loadSubstanceProducts();
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

  loadSubstanceProducts() {

    this.getSubstanceProducts();
    this.pageChangeFda();

    /*
    this.searchControl.valueChanges.subscribe(value => {
      this.filterList(value, this.products, this.analyticsEventCategory);
    }, error => {
      console.log(error);
    });

    this.countUpdate.emit(this.products.length);
    */
  }

  getSubstanceProducts(): void {
    console.log("IN PROD BDNUM: " + this.bdnum);
    this.productService.getSubstanceProducts(this.substance.uuid, this.page, this.pageSize).subscribe(products => {
  
     //this.myDataSource = new MatTableDataSource();
     // this.myDataSource.data = products;
     // this.results = products;
     
      this.products = products;
      this.filtered = products;
      this.filteredData = products;
      this.totalRecords = this.productService.totalRecords;
      //this.pageChangeFda();

  //    console.log("PROD TOTAL: " + this.totalRecords + " FILTER Length: " + this.filtered);
  
      //Call this function to populate paged[] to display in table
      //this.pageChangeFda();  
    //  console.log("product Length: " + products.length);
       //console.log("products: " + this.myDataSource.data);
    
    });
  }

  
  pageChangeFda(): void {
    
    this.paged = [];
    
    console.log("filteredData length: " + this.filteredData.length);

  for (let i = 0; i < this.filteredData.length; i++) {
    console.log('INSIDE: ' + i);
    if (this.filteredData[i] != null) {
        console.log('INSIDE');
        this.paged.push(this.filteredData[i]);
    } else {
        break;
    }
  }
  
}


}
