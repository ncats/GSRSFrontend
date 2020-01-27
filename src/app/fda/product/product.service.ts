import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { Observable,  } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductService extends BaseHttpService {

  totalRecords: 0;

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
  ) {
    super(configService);
  }

  getSubstanceProducts(substanceUuid: string, page:number, pageSize: number): Observable<Array<any>> {
 
    const url = 'http://localhost:9000/ginas/app/productListBySubstanceUuid?substanceUuid=' + substanceUuid + '&page=' + (page+1) + '&pageSize=' + pageSize;
    //const url = `${this.apiBaseUrl}productelist/`;
    return this.http.get<Array<any>>(url)
    .pipe(
      map(results => {
        this.totalRecords = results['totalRecords'];
        return results['data'];
      })
    );
    //return this.http.get<Array<any>>('/assets/data/gsrs-products-test.json');
  }

  getProduct(productId: number): Observable<any> {
    return this.http.get<any>('/assets/data/gsrs-products-test.json').pipe(
      map(products => {
        return products[0];
      })
    );
  }
}
