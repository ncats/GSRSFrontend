import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable ({providedIn: 'root'})
export class CanImportData implements CanActivate {
    constructor(
            private router: Router,
            private authService: AuthService
        ) { }
    
        async canActivate(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
        ):  Promise<boolean | UrlTree>  {
            const auth = this.authService.getAuth();
            if (auth) {
                const canImportNow = await this.authService.hasSpecificPrivilege("Import Data");
                if( canImportNow) {
                    return true;
                } else {
                    return this.router.parseUrl('/home');
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