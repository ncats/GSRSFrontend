import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class CanActivateAdmin implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):  Promise<boolean | UrlTree> {
        const auth = await this.authService.getAuth();
        if (auth) {
            let canRunSomethingAdmin = await this.authService.hasAnyPrivilege('Configure System', 'Import Data', 
                'Manage Users', 'Manage CVs', 'Run Tasks');
            if( canRunSomethingAdmin) {
              console.log('   has priv to configure system');
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
