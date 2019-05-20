import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const authToken = sessionStorage.getItem('authToken');
        if (authToken) {
            req = req.clone({
                headers: req.headers.set('auth-token', authToken)
            });
        }

        return next.handle(req);
    }
}
