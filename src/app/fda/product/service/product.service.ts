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
import { Product, ProductProvenance, ProductName, ProductTermAndPart, ProductCode, ProductAll, ProductDocumentation } from '../model/product.model';
import { ProductCompany, ProductCompanyCode, ProductIndication, ProductManufactureItem, ProductManufacturer, ProductLot, ProductIngredient } from '../model/product.model';
import { ValidationResults } from '../model/product.model';
import { SubstanceSuggestionsGroup } from '@gsrs-core/utils/substance-suggestions-group.model';

@Injectable()
export class ProductService extends BaseHttpService {

  private _bypassUpdateCheck = false;
  private productStateHash?: number;
  totalRecords = 0;
  product: Product;

  apiBaseUrlWithProductEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/products' + '/';
  //apiBaseUrlWithProductBrowseEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/productsall' + '/';
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

    // Commenting out, this function calls productsall
    // const url = this.apiBaseUrlWithProductBrowseEntityUrl + 'search';
    const url = this.apiBaseUrlWithProductEntityUrl + 'search';
    const options = {
      params: params
    };

    // Commenting out, this function calls productsall
    // return this.http.get<PagingResponse<ProductAll>>(url, options);
    return this.http.get<PagingResponse<Product>>(url, options);
  }

  // This function is called when doing text search on the facet
  getProductFacets(facet: Facet, searchTerm?: string, nextUrl?: string): Observable<FacetQueryResponse> {
    let url: string;
    if (searchTerm) {
      url = `${this.configService.configData.apiBaseUrl}api/v1/products/search/@facets?wait=false&kind=gov.hhs.gsrs.products.product.models.Product&skip=0&fdim=200&sideway=true&field=${facet.name.replace(' ', '+')}&top=14448&fskip=0&fetch=100&termfilter=SubstanceDeprecated%3Afalse&order=%24lastEdited&ffilter=${searchTerm}`;
    } else if (nextUrl != null) {
      url = nextUrl;
    } else {
      url = facet._self;
    }
    return this.http.get<FacetQueryResponse>(url);
  }

  // Commenting out, this function calls productsall
  /*
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
  */

  filterFacets(name: string, category: string): Observable<any> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/products/search/@facets?wait=false&kind=gov.hhs.gsrs.products.product.models.Product&skip=0&fdim=200&sideway=true&field=${category}&top=14448&fskip=0&fetch=100&order=%24lastUpdated&ffilter=${name}`;
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
    //const url = this.apiBaseUrlWithProductBrowseEntityUrl + `export/${etag}`;
    const url = this.apiBaseUrlWithProductEntityUrl + `export/${etag}`;
    return this.http.get<any>(url);
  }

  getApiExportUrl(etag: string, extension: string): string {
    // const url = this.apiBaseUrlWithProductBrowseEntityUrl + `export/${etag}/${extension}`;
    const url = this.apiBaseUrlWithProductEntityUrl + `export/${etag}/${extension}`;
    return url;
  }

  getProductSearchSuggestions(searchTerm: string): Observable<SubstanceSuggestionsGroup> {
    //return this.http.get<SubstanceSuggestionsGroup>(this.apiBaseUrlWithProductBrowseEntityUrl + 'suggest?q=' + searchTerm);
    return this.http.get<SubstanceSuggestionsGroup>(this.apiBaseUrlWithProductEntityUrl + 'suggest?q=' + searchTerm);
  }

  getProductProvenanceList(
    substanceKey: string
  ): Observable<any> {
    // const url = this.apiBaseUrlWithProductBrowseEntityUrl + 'distprovenance/' + substanceUuid;
    const url = this.apiBaseUrlWithProductEntityUrl + 'distinctprovenance/' + substanceKey;
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
        productProvenances: [],
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

  addNewProductProvenance(): void {
    const newProductProvenance: ProductProvenance =
      { productNames: [], productCodes: [], productCompanies: [], productDocumentations: [], productIndications: [] };
    this.product.productProvenances.unshift(newProductProvenance);
  }

  addNewProductNameInProv(prodProvenanceIndex: number): void {
    if (this.product.productProvenances[prodProvenanceIndex].productNames == null) {
      this.product.productProvenances[prodProvenanceIndex].productNames = [];
    }

    const newProductName: ProductName = {};
    this.product.productProvenances[prodProvenanceIndex].productNames.push(newProductName);
  }

  addNewTermAndTermPartInProv(productProvenanceIndex: number, prodNameIndex: number) {
    if (this.product.productProvenances[productProvenanceIndex].productNames[prodNameIndex].productTermAndParts == null) {
      this.product.productProvenances[productProvenanceIndex].productNames[prodNameIndex].productTermAndParts = [];
    }

    const newProductPartTerm: ProductTermAndPart = {};
    this.product.productProvenances[productProvenanceIndex].productNames[prodNameIndex].productTermAndParts.push(newProductPartTerm);
  }

  addNewProductCodeInProv(prodProvenanceIndex: number): void {
    if (this.product.productProvenances[prodProvenanceIndex].productCodes == null) {
      this.product.productProvenances[prodProvenanceIndex].productCodes = [];
    }

    const newProductCode: ProductCode = {};
    this.product.productProvenances[prodProvenanceIndex].productCodes.push(newProductCode);
  }

  addNewProductCompanyInProv(prodProvenanceIndex: number): void {
    if (this.product.productProvenances[prodProvenanceIndex].productCompanies == null) {
      this.product.productProvenances[prodProvenanceIndex].productCompanies = [];
    }

    const newProductCompany: ProductCompany = { productCompanyCodes: [] };
    this.product.productProvenances[prodProvenanceIndex].productCompanies.push(newProductCompany);
  }

  addNewProductCompanyCodeInProv(prodProvenanceIndex: number, productCompanyIndex: number): void {
    if (this.product.productProvenances[prodProvenanceIndex].productCompanies[productCompanyIndex].productCompanyCodes == null) {
      this.product.productProvenances[prodProvenanceIndex].productCompanies[productCompanyIndex].productCompanyCodes = [];
    }

    const newProductCompanyCode: ProductCompanyCode = {};
    this.product.productProvenances[prodProvenanceIndex].productCompanies[productCompanyIndex].productCompanyCodes.push(newProductCompanyCode);
  }

  addNewProductDocumentation(prodProvenanceIndex: number): void {
    if (this.product.productProvenances[prodProvenanceIndex].productDocumentations == null) {
      this.product.productProvenances[prodProvenanceIndex].productDocumentations = [];
    }

    const newProductDocumentation: ProductDocumentation = {};
    this.product.productProvenances[prodProvenanceIndex].productDocumentations.push(newProductDocumentation);
  }

  addNewProductIndication(prodProvenanceIndex: number): void {
    if (this.product.productProvenances[prodProvenanceIndex].productIndications == null) {
      this.product.productProvenances[prodProvenanceIndex].productIndications = [];
    }

    const newProductIndication: ProductIndication = {};
    this.product.productProvenances[prodProvenanceIndex].productIndications.push(newProductIndication);
  }

  addNewProductComponent(): void {
    const newProductComponent: ProductManufactureItem = {
      productManufacturers: [],
      productLots: [{
        productIngredients: [{}]
      }]
    };
    this.product.productManufactureItems.unshift(newProductComponent);
  }

  addNewProductManufacturer(prodComponentIndex: number): void {
    if (this.product.productManufactureItems[prodComponentIndex].productManufacturers == null) {
      this.product.productManufactureItems[prodComponentIndex].productManufacturers = [];
    }

    const newProductManu: ProductManufacturer = {};
    this.product.productManufactureItems[prodComponentIndex].productManufacturers.unshift(newProductManu);
  }

  addNewProductLot(prodComponentIndex: number): void {
    const newProductLot: ProductLot = { productIngredients: [{}] };
    this.product.productManufactureItems[prodComponentIndex].productLots.unshift(newProductLot);
  }

  addNewProductIngredient(prodComponentIndex: number, prodLotIndex: number): void {
    const newProductIngredient: ProductIngredient = {};
    this.product.productManufactureItems[prodComponentIndex].productLots[prodLotIndex].productIngredients.unshift(newProductIngredient);
  }

  deleteProductProvenance(prodProvenanceIndex: number) {
    this.product.productProvenances.splice(prodProvenanceIndex, 1);
  }

  deleteProductNameInProv(prodProvenanceIndex: number, prodNameIndex: number) {
    this.product.productProvenances[prodProvenanceIndex].productNames.splice(prodNameIndex, 1);
  }

  deleteProductTermAndTermPart(prodProvenanceIndex: number, prodNameIndex: number, prodNameTermIndex: number) {
    this.product.productProvenances[prodProvenanceIndex].productNames[prodNameIndex].productTermAndParts.splice(prodNameTermIndex, 1);
  }

  deleteProductCodeInProv(prodProvenanceIndex: number, prodCodeIndex: number) {
    this.product.productProvenances[prodProvenanceIndex].productCodes.splice(prodCodeIndex, 1);
  }

  deleteProductCompanyInProv(prodProvenanceIndex: number, prodCompanyIndex: number): void {
    this.product.productProvenances[prodProvenanceIndex].productCompanies.splice(prodCompanyIndex, 1);
  }

  deleteProductCompanyCodeInProv(prodProvenanceIndex: number, prodCompanyIndex: number, prodCompanyCodeIndex: number): void {
    this.product.productProvenances[prodProvenanceIndex].productCompanies[prodCompanyIndex].productCompanyCodes.splice(prodCompanyCodeIndex, 1);
  }

  deleteProductDocumentationInProv(prodProvenanceIndex: number, prodDocIndex: number): void {
    this.product.productProvenances[prodProvenanceIndex].productDocumentations.splice(prodDocIndex, 1);
  }

  deleteProductIndication(prodProvenanceIndex: number, prodIndicationIndex: number): void {
    this.product.productProvenances[prodProvenanceIndex].productIndications.splice(prodIndicationIndex, 1);
  }

  deleteProductComponent(prodComponentIndex: number): void {
    this.product.productManufactureItems.splice(prodComponentIndex, 1);
  }

  deleteProductManufacturer(prodComponentIndex: number, prodManuIndex: number): void {
    this.product.productManufactureItems[prodComponentIndex].productManufacturers.splice(prodManuIndex, 1);
  }

  deleteProductLot(prodComponentIndex: number, prodLotIndex: number): void {
    this.product.productManufactureItems[prodComponentIndex].productLots.splice(prodLotIndex, 1);
  }

  deleteProductIngredient(prodComponentIndex: number, prodLotIndex: number, prodIngredientIndex: number): void {
    this.product.productManufactureItems[prodComponentIndex].productLots[prodLotIndex].productIngredients.splice(prodIngredientIndex, 1);
  }

  copyProductProvenance(productProvenance: any): void {
    const newProductProv = JSON.parse(JSON.stringify(productProvenance));

    newProductProv.id = null;
    newProductProv.internalVersion = null;
    newProductProv.createdBy = null;
    newProductProv.creationDate = null;
    newProductProv.modifiedBy = null;
    newProductProv.createdBy = null;
    newProductProv.lastModifiedDate = null;

    // Product Names
    newProductProv.productNames.forEach(elementName => {
      if (elementName != null) {
        elementName.id = null;
        elementName.internalVersion = null;
        elementName.createdBy = null;
        elementName.creationDate = null;
        elementName.modifiedBy = null;
        elementName.lastModifiedDate = null;

        elementName.productTermAndParts.forEach(elementPart => {
          if (elementPart != null) {
            elementPart.id = null;
            elementPart.internalVersion = null;
            elementPart.createdBy = null;
            elementPart.creationDate = null;
            elementPart.modifiedBy = null;
            elementPart.lastModifiedDate = null;
          }
        });
      }
    });

    // Product Codes
    newProductProv.productCodes.forEach(elementCode => {
      if (elementCode != null) {
        elementCode.id = null;
        elementCode.internalVersion = null;
        elementCode.createdBy = null;
        elementCode.creationDate = null;
        elementCode.modifiedBy = null;
        elementCode.lastModifiedDate = null;
      }
    });

    // Product Companies
    newProductProv.productCompanies.forEach(elementComp => {
      if (elementComp != null) {
        elementComp.id = null;
        elementComp.internalVersion = null;
        elementComp.createdBy = null;
        elementComp.creationDate = null;
        elementComp.modifiedBy = null;
        elementComp.lastModifiedDate = null;

        elementComp.productCompanyCodes.forEach(elementCompCode => {
          if (elementCompCode != null) {
            elementCompCode.id = null;
            elementCompCode.internalVersion = null;
            elementCompCode.createdBy = null;
            elementCompCode.creationDate = null;
            elementCompCode.modifiedBy = null;
            elementCompCode.lastModifiedDate = null;
          }
        });
      }
    });

    // Product Documentation IDs
    newProductProv.productDocumentations.forEach(elementDoc => {
      if (elementDoc != null) {
        elementDoc.id = null;
        elementDoc.internalVersion = null;
        elementDoc.createdBy = null;
        elementDoc.creationDate = null;
        elementDoc.modifiedBy = null;
        elementDoc.lastModifiedDate = null;
      }
    });

    // Product Indications
    newProductProv.productIndications.forEach(elementInd => {
      if (elementInd != null) {
        elementInd.id = null;
        elementInd.internalVersion = null;
        elementInd.createdBy = null;
        elementInd.creationDate = null;
        elementInd.modifiedBy = null;
        elementInd.lastModifiedDate = null;
      }
    });

    this.product.productProvenances.unshift(newProductProv);
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

}
