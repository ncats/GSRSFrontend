import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfTokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // CSRF token for GET and HEAD is not needed
    if (['GET', 'HEAD'].includes(request.method)) {
      return next.handle(request);
    }

    // Parse CSRF token from HTML meta tag
    const metaTag: HTMLMetaElement | null = document.querySelector('meta[name=csrf-token]');
    let csrfToken = metaTag?.content;
    if (csrfToken === undefined) {
      csrfToken = 'CSRF-TOKEN-NOT-PARSED';
    }

    // Clone the request and add the CSRF token to the headers
    const modifiedRequest = request.clone({
      setHeaders: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'X-CSRF-Token': csrfToken
      }
    });

    // Pass the modified request to the next handler
    return next.handle(modifiedRequest);
  }
}
