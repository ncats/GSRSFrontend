import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import {Role} from '@gsrs-core/auth/auth.model';

@Injectable()
export class CanActivateAdminPage implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):  Promise<boolean | UrlTree> {
    const auth = this.authService.getAuth();
    if (auth) {
      console.log(`going to check whether user has one of the required privs`);
      const canDoSomethingAdmin= await this.authService.hasAnyPrivilege("Configure System", "Import Data", "Manage Users", "Manage CVs", "Run Tasks");
      if( canDoSomethingAdmin) {
        console.log('user CAN');
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
