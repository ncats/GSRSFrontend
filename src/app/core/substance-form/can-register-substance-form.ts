import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import {Role} from '@gsrs-core/auth/auth.model';

@Injectable()
export class CanRegisterSubstanceForm implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable(observer => {
      this.authService.getAuth().subscribe(auth => {
        if (auth) {
          this.authService.hasAnyRolesAsync('DataEntry', 'SuperDataEntry').subscribe(response => {
            if (response) {
              observer.next(true);
              observer.complete();
            } else {
              observer.next(false);
              observer.complete();
              this.router.navigate(['/browse-substance']);
            }
          });
        } else {
          const navigationExtras: NavigationExtras = {
            queryParams: {
              path: state.url
            }
          };
          observer.next(false);
          observer.complete();
          this.router.navigate(['/login'], navigationExtras);
        }
      });
    });
  }
}
