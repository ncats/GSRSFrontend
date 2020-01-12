import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { Observable,  } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
  ) {
    super(configService);
  }

  getSubstanceProducts(substanceId: string): Observable<Array<any>> {
    const baseUrl = this.configService.configData.apiBaseUrl;
    const url = 'http://localhost:9000/ginas/app/advSearchResult?page=2&matchType=IN&searchBy=Bdnum&q=0052175AA&boolType=And&matchType2=EM&searchBy2=Substance Name&q2=&searchCategory=product&type=Substructure&struct=&disp=d&dispFrom=detail';
    //const url = `${this.apiBaseUrl}productelist/`;
   
    return this.http.get<Array<any>>(url)
    .pipe(
      map(products => {
        console.log("Product: " + products.data.length);
        return products.data;
      })
    );
  
    //return this.http.get<Array<any>>('/assets/data/gsrs-products-test.json');
  }

  /*
  Observable<PagingResponse<ApplicationSrs>> {
    let params = new SubstanceHttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }

    params = params.appendFacetParams(facets);

    const url = `${this.apiBaseUrl}applicationssrs/search`;
    return this.http.get<PagingResponse<ApplicationSrs>>(url, options);
  }
  */

 
  getProduct(productId: number): Observable<any> {
    return this.http.get<any>('/assets/data/gsrs-products-test.json').pipe(
      map(products => {
        return products[0];
      })
    );
  }
}
