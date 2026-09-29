import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, UrlTree } from '@angular/router';
import { take } from 'rxjs/operators';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ConfigService } from '@gsrs-core/config';
import { Observable } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';

@Injectable()
export class CanActivateRegisterProductFormComponent implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    // precisionFDA only: the registration form never writes to the GSRS database, the submitted
    // product JSON is stored as a file on the pFDA platform instead. Anonymous users are therefore
    // allowed to open the form, same as the substance registration form (see CanRegisterSubstanceForm).
    if (this.configService.configData && this.configService.configData.isPfdaVersion) {
      return true;
    }

    const auth = this.authService.getAuth();
    if (auth) {
      const canRegister = await this.authService.hasSpecificPrivilege('Create');
      if(canRegister){
        return true;
      } else {
        this.router.parseUrl('/browse-products');
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
