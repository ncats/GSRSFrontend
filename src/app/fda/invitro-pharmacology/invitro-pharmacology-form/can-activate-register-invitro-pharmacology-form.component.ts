import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, UrlTree } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { Observable } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';

@Injectable()
export class CanActivateRegisterInvitroPharmacologyFormComponent implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const auth =this.authService.getAuth();
    if (auth) {
      const canEdit = await this.authService.hasSpecificPrivilege('Edit')
      if(canEdit) {
        return true;
      } else {
        this.router.parseUrl('/browse-invitro-pharm');
      }
    } else {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          path: state.url
        }
       };
      this.router.createUrlTree(['/login'], navigationExtras);
    }
  }
}
