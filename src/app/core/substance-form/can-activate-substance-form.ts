import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class CanActivateSubstanceForm implements CanActivate {

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
            console.log('in canActivate, going to check for Edit priv');
            const canEdit =await this.authService.hasSpecificPrivilege('Edit');
            if(canEdit){
                return true;
            }else {
                return this.router.parseUrl('/browse-substance');
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
