import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { Facet } from '@gsrs-core/facets-manager';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { Product, ProductName, ProductTermAndPart, ProductCode, ProductAll } from '../model/product.model';
import { ProductCompany, ProductCompanyCode, ProductIndication, ProductComponent, ProductManufacturer, ProductLot, ProductIngredient } from '../model/product.model';
import { ValidationResults } from '../model/product.model';
import { SubstanceSuggestionsGroup } from '@gsrs-core/utils/substance-suggestions-group.model';

@Injectable()
export class ProductService extends BaseHttpService {

  private _bypassUpdateCheck = false;
  private productStateHash?: number;
  totalRecords = 0;
  product: Product;

  apiBaseUrlWithProductEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/products' + '/';
  apiBaseUrlWithProductBrowseEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/productsall' + '/';
  apiBaseUrlWithProductElistEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/productselist' + '/';

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    public utilsService: UtilsService
  ) {
    super(configService);
  }

  getProducts(
    order: string,
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

    if (order != null && order !== '') {
      params = params.append('order', order);
    }

    const url = this.apiBaseUrlWithProductBrowseEntityUrl + 'search';
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<ProductAll>>(url, options);
  }

  getProductFacets(facet: Facet, searchTerm?: string, nextUrl?: string): Observable<FacetQueryResponse> {
    let url: string;
    if (searchTerm) {
      url = `${this.configService.configData.apiBaseUrl}api/v1/productsall/search/@facets?wait=false&kind=gov.hhs.gsrs.products.productall.models.ProductMainAll&skip=0&fdim=200&sideway=true&field=${facet.name.replace(' ', '+')}&top=14448&fskip=0&fetch=100&termfilter=SubstanceDeprecated%3Afalse&order=%24lastEdited&ffilter=${searchTerm}`;
    } else if (nextUrl != null) {
      url = nextUrl;
    } else {
      url = facet._self;
    }
    return this.http.get<FacetQueryResponse>(url);
  }

  filterFacets(name: string, category: string): Observable<any> {
    const url = this.apiBaseUrlWithProductBrowseEntityUrl + `search/@facets?wait=false&kind=gov.hhs.gsrs.products.productall.models.ProductMainAll&skip=0&fdim=200&sideway=true&field=${category}&top=14448&fskip=0&fetch=100&order=%24lastUpdated&ffilter=${name}`;
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

  getExportOptions(etag: string): Observable<any> {
    const url = this.apiBaseUrlWithProductBrowseEntityUrl + `export/${etag}`;
    return this.http.get< any>(url);
  }

  getApiExportUrl(etag: string, extension: string): string {
    // const url = `${this.configService.configData.apiBaseUrl}api/v1/productmainall/export/${etag}/${extension}`;
    const url = this.apiBaseUrlWithProductBrowseEntityUrl + `export/${etag}/${extension}`;
    return url;
  }

  getProductSearchSuggestions(searchTerm: string): Observable<SubstanceSuggestionsGroup> {
    return this.http.get<SubstanceSuggestionsGroup>(this.apiBaseUrlWithProductBrowseEntityUrl + 'suggest?q=' + searchTerm);
  }

  getProductProvenanceList(
    substanceUuid: string
  ): Observable<any> {
    const url = this.apiBaseUrlWithProductBrowseEntityUrl + 'distprovenance/' + substanceUuid;
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getProductElist(
    productId: string
  ): Observable<any> {
    const url = this.apiBaseUrlWithProductElistEntityUrl + productId;
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  get isProductUpdated(): boolean {
    const productString = JSON.stringify(this.product);
    if (this._bypassUpdateCheck) {
      this._bypassUpdateCheck = false;
      return false;
    } else {
      return this.productStateHash !== this.utilsService.hashCode(productString);
    }
  }

  bypassUpdateCheck(): void {
    this._bypassUpdateCheck = true;
  }

  getProduct(productId: string): Observable<any> {
    const url = this.apiBaseUrlWithProductEntityUrl + productId;
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getViewProductUrl(productId: number): string {
    return this.apiBaseUrlWithProductEntityUrl + productId;
  }

  loadProduct(product?: Product): void {
    // if Product Exists
    if (product != null) {
      this.product = product;
    } else { // new Product
      this.product = {
        productNames: [],
        productCodes: [],
        productCompanies: [],
        productIndications: [],
        productManufactureItems: []
      };
    }
  }

  saveProduct(): Observable<Product> {
    const url = this.apiBaseUrlWithProductEntityUrl;
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
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
    const url = this.apiBaseUrlWithProductEntityUrl + '@validate';
    return this.http.post(url, this.product);
  }

  deleteProduct(productId: number): Observable<any> {
    const options = {
    };
    const url = this.apiBaseUrlWithProductEntityUrl + productId;
    const x = this.http.delete<Product>(url, options);
    return x;
  }

  addNewProductName(): void {
    const newProductName: ProductName = { productTermAndParts: [] };
    this.product.productNames.unshift(newProductName);
  }

  deleteProductName(prodNameIndex: number): void {
    this.product.productNames.splice(prodNameIndex, 1);
  }

  addNewTermAndTermPart(prodNameIndex: number): void {
    if (this.product.productNames[prodNameIndex].productTermAndParts == null) {
      this.product.productNames[prodNameIndex].productTermAndParts = [];
    }
    const newProductPartTerm: ProductTermAndPart = {};
    this.product.productNames[prodNameIndex].productTermAndParts.unshift(newProductPartTerm);
  }

  deleteTermAndTermPart(prodNameIndex: number, prodNameTermIndex: number): void {
    this.product.productNames[prodNameIndex].productTermAndParts.splice(prodNameTermIndex, 1);
  }

  addNewProductCode(): void {
    const newProductCode: ProductCode = {};
    this.product.productCodes.unshift(newProductCode);
  }

  deleteProductCode(prodCodeIndex: number): void {
    this.product.productCodes.splice(prodCodeIndex, 1);
  }

  addNewProductCompany(): void {
    const newProductCompany: ProductCompany = { productCompanyCodes: [] };
    this.product.productCompanies.unshift(newProductCompany);
  }

  deleteProductCompany(prodCompanyIndex: number): void {
    this.product.productCompanies.splice(prodCompanyIndex, 1);
  }

  addNewProductCompanyCode(productCompanyIndex: number): void {
    const newProductCompanyCode: ProductCompanyCode = {};
    this.product.productCompanies[productCompanyIndex].productCompanyCodes.push(newProductCompanyCode);
  }

  deleteProductCompanyCode(prodCompanyIndex: number, prodCompanyCodeIndex: number): void {
    this.product.productCompanies[prodCompanyIndex].productCompanyCodes.splice(prodCompanyCodeIndex, 1);
  }

  addNewProductIndication(): void {
    const newProductIndication: ProductIndication = {};
    this.product.productIndications.unshift(newProductIndication);
  }

  deleteProductIndication(prodIndicationIndex: number): void {
    this.product.productIndications.splice(prodIndicationIndex, 1);
  }

  addNewProductComponent(): void {
    const newProductComponent: ProductComponent = {
      productManufacturers: [],
      productLots: [{
        productIngredients: [{}]
      }]
    };
    this.product.productManufactureItems.unshift(newProductComponent);
  }

  deleteProductComponent(prodComponentIndex: number): void {
    this.product.productManufactureItems.splice(prodComponentIndex, 1);
  }

  addNewProductManufacturer(prodComponentIndex: number): void {
    const newProductManu: ProductManufacturer = {};
    this.product.productManufactureItems[prodComponentIndex].productManufacturers.unshift(newProductManu);
  }

  deleteProductManufacturer(prodComponentIndex: number, prodManuIndex: number): void {
    this.product.productManufactureItems[prodComponentIndex].productManufacturers.splice(prodManuIndex, 1);
  }

  addNewProductLot(prodComponentIndex: number): void {
    const newProductLot: ProductLot = { productIngredients: [{}] };
    this.product.productManufactureItems[prodComponentIndex].productLots.unshift(newProductLot);
  }

  deleteProductLot(prodComponentIndex: number, prodLotIndex: number): void {
    this.product.productManufactureItems[prodComponentIndex].productLots.splice(prodLotIndex, 1);
  }

  addNewProductIngredient(prodComponentIndex: number, prodLotIndex: number): void {
    const newProductIngredient: ProductIngredient = {};
    this.product.productManufactureItems[prodComponentIndex].productLots[prodLotIndex].productIngredients.unshift(newProductIngredient);
  }

  deleteProductIngredient(prodComponentIndex: number, prodLotIndex: number, prodIngredientIndex: number): void {
    this.product.productManufactureItems[prodComponentIndex].productLots[prodLotIndex].productIngredients.splice(prodIngredientIndex, 1);
  }

  copyProductComponent(productComp: any): void {
    const newProduct = JSON.parse(JSON.stringify(productComp));

    newProduct.id = null;
    newProduct.internalVersion = null;
    newProduct.createdBy = null;
    newProduct.creationDate = null;
    newProduct.modifiedBy = null;
    newProduct.createdBy = null;
    newProduct.lastModifiedDate = null;

    newProduct.productLots.forEach(elementLot => {
      if (elementLot != null) {
        elementLot.id = null;
        elementLot.internalVersion = null;
        elementLot.createdBy = null;
        elementLot.creationDate = null;
        elementLot.modifiedBy = null;
        elementLot.lastModifiedDate = null;

        elementLot.productIngredients.forEach(elementIngred => {
          if (elementIngred != null) {
            elementIngred.id = null;
            elementIngred.internalVersion = null;
            elementIngred.createdBy = null;
            elementIngred.creationDate = null;
            elementIngred.modifiedBy = null;
            elementIngred.lastModifiedDate = null;
          }
        });
      }
    });

    this.product.productManufactureItems.unshift(newProduct);
  }

copyProductLot(productLot: any, prodComponentIndex: number): void {
  const newProduct = JSON.parse(JSON.stringify(productLot));

  newProduct.id = null;
  newProduct.createdBy = null;
  newProduct.creationDate = null;
  newProduct.modifiedBy = null;
  newProduct.lastModifiedDate = null;

  newProduct.productIngredients.forEach(elementIngred => {
    if (elementIngred != null) {
      elementIngred.id = null;
      elementIngred.createdBy = null;
      elementIngred.creationDate = null;
      elementIngred.modifiedBy = null;
      elementIngred.lastModifiedDate = null;
    }
  });

  this.product.productManufactureItems[prodComponentIndex].productLots.unshift(newProduct);
}

copyProductIngredient(productIngredient: any, prodComponentIndex: number, prodLotIndex: number): void {
  const newProduct = JSON.parse(JSON.stringify(productIngredient));

  newProduct.id = null;
  newProduct.createdBy = null;
  newProduct.creationDate = null;
  newProduct.modifiedBy = null;
  newProduct.lastModifiedDate = null;

  this.product.productManufactureItems[prodComponentIndex].productLots[prodLotIndex].productIngredients.unshift(newProduct);
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
