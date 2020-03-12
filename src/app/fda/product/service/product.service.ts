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

}
