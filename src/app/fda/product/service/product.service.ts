import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
import { Observable, } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Product, ProductName, ProductTermAndPart, ProductCode, ProductAll } from '../model/product.model';
import { ProductCompany, ProductComponent, ProductLot, ProductIngredient } from '../model/product.model';
import { ValidationResults } from '../model/product.model';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { Facet } from '@gsrs-core/facets-manager';

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

  getProducts(
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): Observable<PagingResponse<ProductAll>> {
    let params = new FacetHttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }

    params = params.appendFacetParams(facets);

    const url = `${this.apiBaseUrl}productmainall/search`;
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<ProductAll>>(url, options);
  }

  getProductFacets(facet: Facet, searchTerm?: string, nextUrl?: string): Observable<FacetQueryResponse> {
    let url: string;
    if (searchTerm) {
      url = `${this.configService.configData.apiBaseUrl}api/v1/productmainall/search/@facets?wait=false&kind=ix.srs.models.ProductElistMain&skip=0&fdim=200&sideway=true&field=${facet.name.replace(' ', '+')}&top=14448&fskip=0&fetch=100&termfilter=SubstanceDeprecated%3Afalse&order=%24lastEdited&ffilter=${searchTerm}`;
    } else if (nextUrl != null) {
      url = nextUrl;
    } else {
      url = facet._self;
    }
    return this.http.get<FacetQueryResponse>(url);
  }

  filterFacets(name: string, category: string): Observable<any> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/applicationssrs/search/@facets?wait=false&kind=ix.srs.models.ApplicationSrs&skip=0&fdim=200&sideway=true&field=${category}&top=14448&fskip=0&fetch=100&termfilter=SubstanceDeprecated%3Afalse&order=%24lastEdited&ffilter=${name}`;
    return this.http.get(url);
  }

  retrieveFacetValues(facet: Facet): Observable<any> {
    const url = facet._self;
    return this.http.get<any>(url);
  }

  retrieveNextFacetValues(facet: Facet): Observable<any> {
    const url = facet._self;
    if (!facet.$next) {
      return this.http.get<any>(url).pipe(
        switchMap(response => {
          if (response) {
            const next = response.nextPageUri;
            return this.http.get<any>(next);
          } else {
            return 'nada';
          }
        }));
    } else {
      return this.http.get<any>(facet.$next);
    }

  }

  getApiExportUrl(etag: string, extension: string): string {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/productmainall/export/${etag}/${extension}`;
    return url;
  }

  getSubstanceProducts(
    substanceUuid: string, country: string, page: number, pageSize: number
  ): Observable<Array<any>> {

    const funcName = 'productListBySubstanceUuid?substanceUuid=';
    const url = this.baseUrl + funcName + substanceUuid + '&country=' + country + '&page=' + (page + 1) + '&pageSize=' + pageSize;

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
        productNameList: [{}],
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
    const url = this.apiBaseUrl + `product`;
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
    const url = `${this.configService.configData.apiBaseUrl}api/v1/product/@validate`;
    return this.http.post(url, this.product);
  }

  deleteProduct(): Observable<any> {
    const url = this.apiBaseUrl + 'product(' + this.product.id + ')';
    const params = new HttpParams();
    const options = {
      params: params
    };
    const x = this.http.delete<Product>(url, options);
    return x;
  }

  getSubstanceDetailsByBdnum(
    bdnum: string
  ): Observable<any> {
    const url = this.baseUrl + 'getSubstanceDetailsByBdnum?bdnum=' + bdnum;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getSubstanceDetailsBySubstanceId(
    substanceId: string
  ): Observable<any> {
    const url = this.baseUrl + 'getSubstanceDetailsBySubstanceId?substanceId=' + substanceId;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getSubstanceRelationship(
    substanceId: string
  ): Observable<Array<any>> {
    const url = this.baseUrl + 'getRelationshipBySubstanceId?substanceId=' + substanceId;
    return this.http.get<Array<any>>(url).pipe(
      map(results => {
        return results['data'];
      })
    );
  }

  addNewProductName(): void {
    const newProductName: ProductName = { productTermAndTermPartList: [] };
    this.product.productNameList.unshift(newProductName);
  }

  deleteProductName(prodNameIndex: number): void {
    this.product.productNameList.splice(prodNameIndex, 1);
  }

  addNewTermAndTermPart(prodNameIndex: number): void {
    if (this.product.productNameList[prodNameIndex].productTermAndTermPartList == null) {
      this.product.productNameList[prodNameIndex].productTermAndTermPartList = [];
    }
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

  addNewProductComponent(): void {
    const newProductComponent: ProductComponent = {
      productLotList: [{
        productIngredientList: [{}]
      }]
    };
    this.product.productComponentList.unshift(newProductComponent);
  }

  deleteProductComponent(prodComponentIndex: number): void {
    this.product.productComponentList.splice(prodComponentIndex, 1);
  }

  addNewProductLot(prodComponentIndex: number): void {
    const newProductLot: ProductLot = {productIngredientList: [{}]};
    this.product.productComponentList[prodComponentIndex].productLotList.unshift(newProductLot);
  }

  deleteProductLot(prodComponentIndex: number, prodLotIndex: number): void {
    this.product.productComponentList[prodComponentIndex].productLotList.splice(prodLotIndex, 1);
  }

  addNewProductIngredient(prodComponentIndex: number, prodLotIndex: number): void {
    const newProductIngredient: ProductIngredient = {};
    this.product.productComponentList[prodComponentIndex].productLotList[prodLotIndex].productIngredientList.unshift(newProductIngredient);
  }

  deleteProductIngredient(prodComponentIndex: number, prodLotIndex: number, prodIngredientIndex: number): void {
    this.product.productComponentList[prodComponentIndex].productLotList[prodLotIndex].productIngredientList.splice(prodIngredientIndex, 1);
  }

  copyProductComponent(productComp: any): void {
    const newProduct = JSON.parse(JSON.stringify(productComp));
    this.product.productComponentList.unshift(newProduct);
  }

  copyProductLot(productLot: any, prodComponentIndex: number): void {
    const newProduct = JSON.parse(JSON.stringify(productLot));
    this.product.productComponentList[prodComponentIndex].productLotList.unshift(newProduct);
  }

  copyProductIngredient(productIngredient: any, prodComponentIndex: number, prodLotIndex: number): void {
    const newProduct = JSON.parse(JSON.stringify(productIngredient));
    this.product.productComponentList[prodComponentIndex].productLotList[prodLotIndex].productIngredientList.unshift(newProduct);
  }
   /*

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
