import { Injectable } from '@angular/core';
import { Router, CanActivate, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class CanActivateSubstanceAddEdit implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService
    ) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return new Observable(observer => {
            this.authService.hasRolesAsync('admin').subscribe(response => {
                console.log(response);
                if (response) {
                    observer.next(true);
                    observer.complete();
                } else {
                    observer.next(false);
                    observer.complete();
                    this.router.navigate(['/browse-substance']);
                }
            });
        });
    }
}
