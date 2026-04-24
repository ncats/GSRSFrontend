import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { ConfigService } from "@gsrs-core/config";

@Injectable()
export class CsrfTokenInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (['GET', 'HEAD'].includes(request.method)) {
      return next.handle(request);
    }

    if (this.configService.configData?.isPfdaVersion) {
      return from(this.fetchCsrfToken()).pipe(
        switchMap((token: string) => {
          return next.handle(this.addCsrfToken(request, token));
        })
      );
    }

    // Non-pFDA: read CSRF token from HTML meta tag
    const metaTag: HTMLMetaElement | null = document.querySelector('meta[name=csrf-token]');
    const csrfToken = metaTag?.content || 'CSRF-TOKEN-NOT-PARSED';
    return next.handle(this.addCsrfToken(request, csrfToken));
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
