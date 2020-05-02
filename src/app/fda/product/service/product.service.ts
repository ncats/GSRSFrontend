import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { Observable, } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductName, ProductTermAndPart, ProductCode } from '../model/product.model';
import { ProductCompany, ProductComponent } from '../model/product.model';
import { ValidationResults } from '../model/product.model';

@Injectable()
export class ProductService extends BaseHttpService {

  totalRecords: 0;
  product: Product;

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
  ) {
    super(configService);
  }

  getSubstanceProducts(
    substanceUuid: string, page: number, pageSize: number
  ): Observable<Array<any>> {

    const funcName = 'productListBySubstanceUuid?substanceUuid=';
    const url = this.baseUrl + funcName + substanceUuid + '&page=' + (page + 1) + '&pageSize=' + pageSize;

    return this.http.get<Array<any>>(url)
      .pipe(
        map(results => {
          this.totalRecords = results['totalRecords'];
          return results['data'];
        })
      );

  }

  getProduct(productId: string, src: string): Observable<any> {
    const url = this.baseUrl + 'productDetails2?id=' + productId + '&src=' + src;

    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getIngredientNameByBdnum(
    bdnum: string)
    : Observable<any> {
    const url = this.baseUrl + 'getIngredientNameByBdnum?bdnum=' + bdnum;

    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getProductListExportUrl(substanceId: string): string {
    return this.baseUrl + 'productListExport?substanceId=' + substanceId;
  }

  loadProduct(product?: Product): void {
    // if Update/Exist Application
    // setTimeout(() => {
    if (product != null) {
      this.product = product;

      /*
      // Add a new Indication if there is no indication record.
      if (this.product.applicationIndicationList.length < 1) {
        const newIndication: ApplicationIndicationSrs = {};
        this.product.applicationIndicationList.unshift(newIndication);
      }
      */
      // Add a new Product Name if there is no Product Name record.
      /* if (this.application.applicationProductList[0].applicationProductNameList.length < 1) {
         const newProductNameSrs: ProductNameSrs = {};
         this.application.applicationProductList[0].applicationProductNameList.unshift(newProductNameSrs);
       }
      */
      //  console.log('AFTER' + JSON.stringify(this.product));
    } else {
      this.product = {
        productNameList: [{
          productTermAndTermPartList: []
        }],
        productCodeList: [{}],
        productCompanyList: [{}],
        productComponentList: [{
          productLotList: [{
            productIngredientList: [{}]
          }]
        }]
      };
    }
    //  });
  }

  saveProduct(): Observable<Product> {
    const url = this.apiBaseUrl + `applicationssrs`;
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
    //  console.log('APP: ' + this.application);

    // Update Product
    if ((this.product != null) && (this.product.id)) {
      return this.http.put<Product>(url, this.product, options);
    } else {
      // Save New Product
      return this.http.post<Product>(url, this.product, options);
    }
  }

  validateProduct(): Observable<ValidationResults> {
    return new Observable(observer => {
      this.validateProd().subscribe(results => {
        observer.next(results);
        observer.complete();
      }, error => {
        observer.error();
        observer.complete();
      });
    });
  }

  validateProd(): Observable<ValidationResults> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/applicationssrs/@validate`;
    return this.http.post(url, this.product);
  }

  addNewProductName(): void {
    const newProductName: ProductName = {productTermAndTermPartList: [] };
    this.product.productNameList.unshift(newProductName);
  }

  deleteProductName(prodNameIndex: number): void {
    this.product.productNameList.splice(prodNameIndex, 1);
  }

  addNewTermAndTermPart(prodNameIndex: number): void {
    const newProductPartTerm: ProductTermAndPart = {};
    this.product.productNameList[prodNameIndex].productTermAndTermPartList.unshift(newProductPartTerm);
  }

  deleteTermAndTermPart(prodNameIndex: number, prodNameTermIndex: number): void {
    this.product.productNameList[prodNameIndex].productTermAndTermPartList.splice(prodNameTermIndex, 1);
  }

  addNewProductCode(): void {
    const newProductCode: ProductCode = {};
    this.product.productCodeList.unshift(newProductCode);
  }

  deleteProductCode(prodCodeIndex: number): void {
    this.product.productCodeList.splice(prodCodeIndex, 1);
  }

  addNewProductCompany(): void {
    const newProductCompany: ProductCompany = {};
    this.product.productCompanyList.unshift(newProductCompany);
  }

  deleteProductCompany(prodCompanyIndex: number): void {
    this.product.productCompanyList.splice(prodCompanyIndex, 1);
  }

  /*
  deleteIndication(indIndex: number): void {
    this.application.applicationIndicationList.splice(indIndex, 1);
  }

  addNewProduct(): void {
    const newProduct: ProductSrs = {
      applicationProductNameList: [{}],
      applicationIngredientList: [{}]
    };

    this.application.applicationProductList.unshift(newProduct);
  }

  addNewProductName(prodIndex: number): void {
    const newProductName: ProductNameSrs = {};

    this.application.applicationProductList[prodIndex].applicationProductNameList.unshift(newProductName);
  }

  deleteProduct(prodIndex: number): void {
    this.application.applicationProductList.splice(prodIndex, 1);
  }

  deleteProductName(prodIndex: number, prodNameIndex: number): void {
    this.application.applicationProductList[prodIndex].applicationProductNameList.splice(prodNameIndex, 1);
  }

  copyProduct(product: any): void {
    const newProduct = JSON.parse(JSON.stringify(product));
    newProduct.reviewedBy = null;
    newProduct.reviewDate = null;
    this.application.applicationProductList.unshift(newProduct);
  }

  reviewProduct(prodIndex: number): void {
    //  this.application.applicationProductList[prodIndex].applicationIngredientList.unshift(newIngredient);
  }

  addNewIngredient(index: number): void {
    const newIngredient: ApplicationIngredient = {};
    this.application.applicationProductList[index].applicationIngredientList.unshift(newIngredient);
  }

  deleteIngredient(prodIndex: number, ingredIndex: number): void {
    this.application.applicationProductList[prodIndex].applicationIngredientList.splice(ingredIndex, 1);
  }

  copyIngredient(ingredient: any, prodIndex: number): void {
    const newIngredient = JSON.parse(JSON.stringify(ingredient));
    newIngredient.reviewedBy = null;
    newIngredient.reviewDate = null;
    this.application.applicationProductList[prodIndex].applicationIngredientList.unshift(newIngredient);
  }

  reviewIngredient(prodIndex: number, ingredIndex: number): void {
    //  this.application.applicationProductList[prodIndex].applicationIngredientList.unshift(newIngredient);
  }

  getJson() {
    return this.application;
  }

  getUpdateApplicationUrl(): string {
    return this.baseUrl + 'updateApplication?applicationId=';
  }

  getApplicationListExportUrl(bdnum: string): string {
    return this.baseUrl + 'applicationListExport?bdnum=' + bdnum;
  }
*/
}
