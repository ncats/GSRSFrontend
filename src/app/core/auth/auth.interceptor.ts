import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (isPlatformBrowser(this.platformId)) {
            const authToken = sessionStorage.getItem('authToken');
            if (authToken) {
                req = req.clone({
                    headers: req.headers.set('auth-token', authToken)
                });
            }
        }

        return next.handle(req);
    }
}
