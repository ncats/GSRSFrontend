import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, UrlTree } from '@angular/router';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ConfigService } from '@gsrs-core/config';

@Injectable()
export class CanActivateRegisterInvitroPharmacologyFormComponent implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    // precisionFDA only: the registration forms never write to the GSRS database, the submitted
    // in-vitro pharmacology JSON is stored as a file on the pFDA platform instead. Anonymous users
    // are therefore allowed to open the forms, same as the product registration form.
    if (this.configService.configData && this.configService.configData.isPfdaVersion) {
      return true;
    }

    const auth =this.authService.getAuth();
    if (auth) {
      const canEdit = await this.authService.hasSpecificPrivilege('Edit')
      if(canEdit) {
        return true;
      } else {
        return this.router.parseUrl('/browse-invitro-pharm');
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
