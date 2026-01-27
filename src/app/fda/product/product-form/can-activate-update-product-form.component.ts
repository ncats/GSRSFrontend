import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, UrlTree } from '@angular/router';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class CanActivateUpdateProductFormComponent implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        const auth = this.authService.getAuth();
        if (auth) {
            const canEdit = await this.authService.hasSpecificPrivilege('Edit');
            if(canEdit){
                return true;
            } else {
                return this.router.parseUrl('/browse-products');
            }
        } else {
            const navigationExtras: NavigationExtras = {
                queryParams: {
                    path: state.url
                }
            };
            return this.router.createUrlTree(['/login'], navigationExtras);
        }
    }
}
