import { Injectable } from '@angular/core';
import { HttpClient, HttpParameterCodec, HttpParams } from '@angular/common/http';
import { Observable, Observer, } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { Facet } from '@gsrs-core/facets-manager';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { Product, ProductProvenance, ProductName, ProductTermAndPart, ProductCode, ProductDocumentation } from '../model/product.model';
import { ProductCompany, ProductCompanyCode, ProductIndication, ProductManufactureItem, ProductManufacturer, ProductLot, ProductIngredient } from '../model/product.model';
import { ValidationResults } from '../model/product.model';
import { SubstanceSuggestionsGroup } from '@gsrs-core/utils/substance-suggestions-group.model';
import { BulkSearch } from '@gsrs-core/bulk-search/bulk-search.model';

class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}
@Injectable()
export class ProductService extends BaseHttpService {

  private entity = 'products';
  private _bypassUpdateCheck = false;
  private productStateHash?: number;
  totalRecords = 0;
  product: Product;
  public showDeprecated = false;
  private searchKeys: { [structureSearchTerm: string]: string } = {};

  apiBaseUrlWithProductEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/products' + '/';
  apiBaseUrlWithProductElistEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/productselist' + '/';

  // get service prefix url
  restApiPrefix = this.configService.configData && this.configService.configData.restApiPrefix || '';

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    public utilsService: UtilsService
  ) {
    super(configService);
  }

  getBulkSearchUrl(searchEntity: string, useServiceInUrl: boolean = false): string {

    let url = this.apiBaseUrl;

    let apiAddUrlPrefixToBackendUrls = '';

    if (searchEntity !== 'substances') {
      if (useServiceInUrl == true) {

        if (url.indexOf(this.restApiPrefix) > 0) {
          apiAddUrlPrefixToBackendUrls = '';
        } else {
          apiAddUrlPrefixToBackendUrls = this.restApiPrefix;
        }

        url = url.replace('/api/v1/', apiAddUrlPrefixToBackendUrls + '/service/' + searchEntity + '/api/v1/');
      }
    }
    
    return url;
  }

  getProducts(
    order: string,
    skip: number = 0,
    top: number = 10,
    searchTerm?: string,
    facets?: FacetParam,
    fdim: number = 10,
    bulkQID?: string,
    searchOnIdentifiers?: boolean,
    view?: string,
    viewfield?: string,
    facetlabel?: string,
    simpleSearchOnly?: boolean
  ): Observable<PagingResponse<Product>> {
    return new Observable(observer => {

      if (bulkQID != null && bulkQID.toString() != '') {
        // Perform bulk search
        this.productBulkSearch(
          searchTerm,
          bulkQID,
          searchOnIdentifiers,
          this.entity,
          top,
          facets,
          order,
          skip
        ).subscribe(response => {
          observer.next(response);
        }, error => {
          observer.error(error);
        }, () => {
          observer.complete();
        });

        //}); // subscribe

      } else {
        const url = this.apiBaseUrlWithProductEntityUrl + 'search';

        let params = new FacetHttpParams();

        params = params.append('skip', skip.toString());
        params = params.append('top', top.toString());
        params = params.append('fdim', fdim.toString());

        if (view) {
          params = params.append('view', view); // setting view=key or full, faster result
        }

        if (viewfield) {
          params = params.append('viewfield', viewfield); // setting viewfield=id or facet, faster result
        }

        if (facetlabel) {
          params = params.append('facetlabel', facetlabel); // setting facetlabel=FDA UNII, faster result, no content
        }

        if (simpleSearchOnly) {
          params = params.append('simpleSearchOnly', simpleSearchOnly.toString()); // if setting simpleSearchOnly=true, do not return facets
        }

        if (searchTerm) {
          params = params.append('q', searchTerm);
        }

        params = params.appendFacetParams(facets);

        if (order) {
          params = params.append('order', order);
        }

        const options = {
          params: params
        };

        // Return Product search results
        return this.http.get<PagingResponse<Product>>(url, options).subscribe(
          response => {
            if (response) {
              observer.next(response);
              observer.complete();
            }
          }, error => {
            observer.error(error);
            observer.complete();
          });
      } // else search

    });  // Observable(observer) 
  }

  productBulkSearch(
    querySearchTerm?: string,
    bulkQID?: string,
    searchOnIdentifiers?: boolean,
    searchEntity?: string,
    pageSize: number = 10,
    facets?: FacetParam,
    order?: string,
    skip: number = 0,
  ): Observable<PagingResponse<Product>> {
    return new Observable(observer => {
      let params = new FacetHttpParams({ encoder: new CustomEncoder() });

      let url = this.getBulkSearchUrl(searchEntity, true);

      if (url) {
        url = url + `${this.entity}/bulkSearch`;
      } else {
        url = this.configService.configData.apiBaseUrl + 'api/v1/' + this.entity + '/bulkSearch';
      }

      params = params.append('bulkQID', bulkQID.toString());
      let v = "false";
      if (searchOnIdentifiers === true) { v = "true"; }
      params = params.append('searchOnIdentifiers', v);
      params = params.append('searchEntity', searchEntity);

      const options = {
        params: params
      };

      this.http.get<any>(url, options).subscribe(
        response => {
          // call async
          if (response.results) {
            const resultKey = response.key;

            this.processAsyncSearchResults(
              searchEntity,
              querySearchTerm,
              url,
              response,
              observer,
              resultKey,
              options,
              pageSize,
              facets,
              skip,
              order
            );
          } else {
            observer.next(response);
            observer.complete();
          }
        }, error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  private processAsyncSearchResults(
    searchEntity: string,
    querySearchTerm: string,
    url: string,
    bulkSearchResponse: any,
    observer: Observer<PagingResponse<Product>>,
    searchKey: string,
    httpCallOptions: any,
    pageSize?: number,
    facets?: FacetParam,
    skip?: number,
    order?: string,
    view?: string,
  ): void {
    // Get Buk Search Results
    this.getAsyncSearchResults(
      searchEntity,
      querySearchTerm,
      searchKey,
      pageSize,
      facets,
      skip,
      view,
      bulkSearchResponse.results,
      order
    )
      .subscribe(bulkSearchStatusResponse => {
        // consider making API backend provide statusKey in JSON
        bulkSearchStatusResponse.statusKey = searchKey;

        // Get search status results url
        let statusUrl = this.getBulkSearchUrl(searchEntity, true);
        bulkSearchStatusResponse.searchStatusUrl = statusUrl;
        bulkSearchStatusResponse.finished = bulkSearchResponse.finished;

        observer.next(bulkSearchStatusResponse);
        if (!bulkSearchResponse.finished) {
          this.http.get<any>(url, httpCallOptions).subscribe(searchResponse => {

            setTimeout(() => {

              this.processAsyncSearchResults(
                searchEntity,
                querySearchTerm,
                url,
                searchResponse,
                observer,
                searchKey,
                httpCallOptions,
                pageSize,
                facets,
                skip,
                order,
                view,
              );
            });
          }, error => {
            observer.error(error);
            observer.complete();
          });
        } else {
          observer.complete();
        }
      }, error => {
        observer.error(error);
        observer.complete();
      });

  }

  private getAsyncSearchResults(
    searchEntity: string,
    querySearchTerm: string,
    searchKey: string,
    pageSize?: number,
    facets?: FacetParam,
    skip?: number,
    view?: string,
    url?: string,
    order?: string
  ): any {

    // Get Bulk Search Results
    url = this.getBulkSearchUrl(searchEntity, true);

    if (url) {
      url = `${url}status(${searchKey})/results`;
    } else {
      url = `${this.configService.configData.apiBaseUrl}api/v1/status(${searchKey})/results`;
    }

    let params = new FacetHttpParams({ encoder: new CustomEncoder() });

    params = params.appendFacetParams(facets);

    // params = params.appendFacetParams({ facet: { isAllMatch: false, params: { cache: false } } }, this.showDeprecated);

    params = params.appendDictionary({
      top: pageSize.toString(),
      skip: skip.toString(),
      view: view || ''
    });

    if (querySearchTerm != null && querySearchTerm !== '') {
      params = params.append('q', querySearchTerm);
    }

    if (order != null && order !== '') {
      params = params.append('order', order);
    }

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<Product>>(url, options);
  }

  /*
  getBulkSearch(
    context: string,
    id: number,
    searchOnIdentifiers: boolean = false,
    facets?: FacetParam
  ): Observable<BulkSearch> {
    const url = this.configService.configData.apiBaseUrl + 'api/v1/' + context + '/bulkSearch';
  
    //let params = new HttpParams();
    let params = new FacetHttpParams({ encoder: new CustomEncoder() });
  
    params = params.append('bulkQID', id.toString());
    params = params.append('searchOnIdentifiers', searchOnIdentifiers.toString());
    params = params.append('searchEntity', context);
  
    params.append('simpleSearchOnly', null);
  
    params = params.appendFacetParams(facets);
  
    const options = {
      params: params,
      type: 'JSON',
      headers: {}
    };
  
    return this.http.get<BulkSearch>(url, options);
  }
  */

  getProductFacetWithSearchCriteria(facetName?: string, facets?: FacetParam, querySearchTerm?: string, fdim?: number): Observable<FacetQueryResponse> {
    let url: string;

    let params = new FacetHttpParams({ encoder: new CustomEncoder() });
    params = params.appendFacetParams(facets);

    if (querySearchTerm != null && querySearchTerm !== '') {
      params = params.append('q', querySearchTerm);
    }

    url = `${this.configService.configData.apiBaseUrl}api/v1/products/search/@facets?wait=false&kind=gov.hhs.gsrs.products.product.models.Product&skip=0&fdim=${fdim}&field=${facetName.replace(' ', '+')}&top=10&fskip=0&fetch=1000000`;

    const options = {
      params: params
    };

    return this.http.get<FacetQueryResponse>(url, options);
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
