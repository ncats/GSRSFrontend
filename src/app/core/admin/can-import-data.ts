import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationExtras, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable ({providedIn: 'root'})
export class CanImportData implements CanActivate {
    constructor(
            private router: Router,
            private authService: AuthService
        ) { }
    
        canActivate(
            route: ActivatedRouteSnapshot,
            state: RouterStateSnapshot
        ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | (boolean | UrlTree) {
            console.log(`in  CanImportData.canActivate`);
            return new Observable(observer => {
                this.authService.getAuth().subscribe(auth => {
                    if (auth) {
                        console.log('   got auth');
                        if(this.authService.hasSpecificPrivilege("Import Data")) {
                            console.log('   has priv Import Data');
                            observer.next(true);
                            observer.complete();
                        } else {
                            observer.next(this.router.parseUrl('/home'));
                            observer.complete();
                        }
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
            });
        }
}