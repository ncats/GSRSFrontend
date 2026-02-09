import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, UrlTree } from '@angular/router';
import { AuthService } from '@gsrs-core/auth/auth.service';

@Injectable()
export class CanActivateUpdateInvitroPharmacologyFormComponent implements CanActivate {

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
            const canRegister = await this.authService.hasSpecificPrivilege('Create');
            if(canRegister ){
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
