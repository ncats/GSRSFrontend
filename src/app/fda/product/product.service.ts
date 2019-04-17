import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@gsrs-core/config/config.service';
import { BaseHttpService } from '@gsrs-core/base/base-http.service';
import { Observable } from 'rxjs';

@Injectable()
export class ProductService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
  ) {
    super(configService);
  }

  getProducts(): Observable<Array<any>> {
    return this.http.get<Array<any>>('/assets/data/gsrs-products-test.json');
  }
}
