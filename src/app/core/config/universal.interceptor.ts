import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest} from '@angular/common/http';

@Injectable()
export class UniversalInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // In Angular 17+, SSR URL resolution is handled automatically by the platform
    // This interceptor is kept for backward compatibility but no longer needs to modify URLs
    return next.handle(req);
  }
}
