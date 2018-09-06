import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { BaseHttpService } from '../base/base-http.service';

@Injectable({
  providedIn: 'root'
})
export class SubstanceService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getSubtances(): Observable<any> {
    return this.http.jsonp<any>(this.apiBaseUrl + 'substances', 'callback');
  }

}
