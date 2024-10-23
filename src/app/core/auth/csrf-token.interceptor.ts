import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient} from '@angular/common/http';
import {from, Observable, switchMap} from 'rxjs';
import {ConfigService} from "@gsrs-core/config";

@Injectable()
export class CsrfTokenInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // CSRF token for GET and HEAD is not needed
    if (['GET', 'HEAD'].includes(request.method) || !(this.configService.configData?.isPfdaVersion)) {
      return next.handle(request);
    }

    return from(this.fetchCsrfToken()).pipe(
      switchMap((token: string) => {
        const modifiedRequest = this.addCsrfToken(request, token);
        return next.handle(modifiedRequest);
      })
    );
  }

  private fetchCsrfToken(): Promise<string> {
    return this.http.get(`/csrf-token`, { responseType: 'text' }).toPromise();
  }

  private addCsrfToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'X-CSRF-Token': token
      }
    });
  }
}
