import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, NavigationExtras, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ConfigService } from '@gsrs-core/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivateProductsComponent implements CanActivate {
  constructor(
    private configService: ConfigService,
    private router: Router
  ) {}
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | (boolean | UrlTree) {
      return new Observable(observer => {
        const loadedComponents = this.configService.configData.loadedComponents || null;
      if (loadedComponents && loadedComponents.products) {
        observer.next(true);
        observer.complete();
              } else {
                observer.next(this.router.parseUrl('/home'));
                observer.complete();
              }
      });

  }
}