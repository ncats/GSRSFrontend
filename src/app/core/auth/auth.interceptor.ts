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
        console.log('calling intercept');
        if (isPlatformBrowser(this.platformId)) {

            try {
                // Reading from config file, and adding additional header
                if (this.configService.configData) {
                    if (this.configService.configData.authenticateAs) {
                        if (this.configService.configData.authenticateAs.apiUsername) {
                            req = req.clone({
                                headers: req.headers.set('auth-username', this.configService.configData.authenticateAs.apiUsername)
                            });
                        }
                        if (this.configService.configData.authenticateAs.apiPassword) {
                            req = req.clone({
                                headers: req.headers.set('auth-password', this.configService.configData.authenticateAs.apiPassword)
                            });
                        }

                        if (this.configService.configData.authenticateAs.apiKey) {
                            req = req.clone({
                                headers: req.headers.set('auth-key', this.configService.configData.authenticateAs.apiKey)
                            });
                        }

                        if (this.configService.configData.authenticateAs.apiToken) {
                            req = req.clone({
                                headers: req.headers.set('auth-token', this.configService.configData.authenticateAs.apiToken)
                            });
                        }
                    }
                } // configData end

                const authToken = sessionStorage.getItem('authToken');
                    req = req.clone({
                        headers: req.headers.set('auth-username', 'admin')
                    });
                    req = req.clone({
                        headers: req.headers.set('auth-password', 'admin')
                    });
                

            } catch (e) {
                console.log('ERROR in intercept function: ' + e);
            }

        }
        return next.handle(req);
    }
}
