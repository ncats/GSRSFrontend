import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, UrlTree } from '@angular/router';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ConfigService } from '@gsrs-core/config';

@Injectable()
export class CanActivateUpdateApplicationFormComponent implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService,
        private configService: ConfigService,

    ) { }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        const loadedComponents = this.configService.configData.loadedComponents || null;
        if (loadedComponents && loadedComponents.applications) {

            const auth = this.authService.getAuth();
            if (auth) {
                const canEdit =await this.authService.hasSpecificPrivilege('Edit');
                if(canEdit){
                    return true;
                } else {
                    return this.router.parseUrl('/browse-applications');
                }
            } else {
                const navigationExtras: NavigationExtras = {
                    queryParams: {
                        path: state.url
                    }
                };
                return this.router.createUrlTree(['/login'], navigationExtras);
            }
        } else {
            return this.router.parseUrl('/home');
        }
    }
}
