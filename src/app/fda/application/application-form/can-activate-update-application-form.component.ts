import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, UrlTree } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { Observable } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';

@Injectable()
export class CanActivateUpdateApplicationFormComponent implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService,
        private configService: ConfigService,

    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | (boolean | UrlTree) {
        return new Observable(observer => {
            const loadedComponents = this.configService.configData.loadedComponents || null;
            if (loadedComponents && loadedComponents.applications) {
            this.authService.getAuth().pipe(take(1)).subscribe(auth => {
                if (auth) {
                    this.authService.hasAnyRolesAsync('Updater', 'SuperUpdater').pipe(take(1)).subscribe(response => {
                        if (response) {
                            observer.next(true);
                            observer.complete();
                        } else {
                            observer.next(this.router.parseUrl('/browse-applications'));
                            observer.complete();
                        }
                    });
                } else {
                    const navigationExtras: NavigationExtras = {
                        queryParams: {
                            path: state.url
                        }
                    };
                    observer.next(this.router.createUrlTree(['/login'], navigationExtras));
                    observer.complete();
                }
            });
        } else {
            observer.next(this.router.parseUrl('/home'));
            observer.complete();
        }
        });
    }
}
