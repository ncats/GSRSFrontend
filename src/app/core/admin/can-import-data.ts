import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

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
            console.log(`in  CanImportData.canActivate`);
            const auth = this.authService.getAuth();
            if (auth) {
                console.log(`  got auth `); 
                const canImportNow = await this.authService.hasSpecificPrivilege("Import Data");
                if( canImportNow) {
                    console.log('   has priv \'Import Data\'');
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