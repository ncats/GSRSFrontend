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

  getSubstanceProducts(substanceUuid: string): Observable<Array<any>> {
 
    const url = 'http://localhost:9000/ginas/app/productListBySubstanceUuid?substanceUuid=' + substanceUuid;
    //const url = `${this.apiBaseUrl}productelist/`;
    return this.http.get<Array<any>>(url)
    .pipe(
      map(products => {
        console.log("Products length: " + products.length);
        return products;
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
