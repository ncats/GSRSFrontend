import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import {Role} from '@gsrs-core/auth/auth.model';
import { ConfigService } from "@gsrs-core/config";

@Injectable()
export class CanRegisterSubstanceForm implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private configService: ConfigService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | (boolean | UrlTree) {
    return new Observable(observer => {
      if (this.configService.configData.isPfdaVersion) {
        observer.next(true);
        observer.complete();
      } else {
        this.authService.getAuth().subscribe(auth => {
          if (auth) {
            this.authService.hasAnyRolesAsync('DataEntry', 'SuperDataEntry').subscribe(response => {
              if (response) {
                observer.next(true);
                observer.complete();
              } else {
                observer.next(this.router.parseUrl('/browse-substance'));
                observer.complete();
              }
            });
          } else {
            const navigationExtras: NavigationExtras = {
              queryParams: {
                path: state.url
              }
            };
            observer.next(this.router.createUrlTree(['/login'], navigationExtras));
            observer.complete();
          }
        });
      }
    });
  }
}
