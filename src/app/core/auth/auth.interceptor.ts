import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@gsrs-core/config/config.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        public configService: ConfigService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (isPlatformBrowser(this.platformId)) {

            // Reading from config file, and adding additional header
            if (this.configService.configData) {
                if (this.configService.configData.authenticateAs) {
                    if (this.configService.configData.authenticateAs.apiUsername !== null) {
                        req = req.clone({
                            headers: req.headers.set('auth-username', this.configService.configData.authenticateAs.apiUsername)
                        });
                    }
                    if (this.configService.configData.authenticateAs.apiPassword !== null) {
                        req = req.clone({
                            headers: req.headers.set('auth-password', this.configService.configData.authenticateAs.apiPassword)
                        });
                    }

                    if (this.configService.configData.authenticateAs.apiKey !== null) {
                        req = req.clone({
                            headers: req.headers.set('auth-key', this.configService.configData.authenticateAs.apiKey)
                        });
                    }

                    if (this.configService.configData.authenticateAs.apiToken !== null) {
                        req = req.clone({
                            headers: req.headers.set('auth-token', this.configService.configData.authenticateAs.apiToken)
                        });
                    }
                }

            } // configData end

            const authToken = sessionStorage.getItem('authToken');
            if (authToken) {
                req = req.clone({
                    headers: req.headers.set('auth-token', authToken)
                });
            }

            return next.handle(req);
        }
    }
}