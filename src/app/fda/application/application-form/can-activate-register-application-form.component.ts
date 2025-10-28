import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, UrlTree } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class CanActivateRegisterApplicationFormComponent implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const auth = this.authService.getAuth();
    if (auth) {
        const canCreate =await this.authService.hasSpecificPrivilege('Create');
        if(canCreate){
            return true;
        } else {
            this.router.parseUrl('/browse-applications');
        }
    } else {
      {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                path: state.url
            }
        };
        this.router.createUrlTree(['/login'], navigationExtras);
      }
    }
  }
}
