import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { Auth, Role } from './auth.model';
import { Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth: Auth;
  private _authUpdate: Subject<Auth> = new Subject();
  private isLoading: boolean;

  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isLoading = true;
    this.fetchAuth().pipe(take(1)).subscribe(auth => {
      if (auth && auth.computedToken != null) {
        this._auth = auth;
      } else {
        this._auth = null;
      }
      this._authUpdate.next(this._auth);
      this.isLoading = false;
    }, error => {
      this._authUpdate.next(null);
      this.isLoading = false;
    });
  }

  private fetchAuth(): Observable<Auth> {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
    return this.http.get<Auth>(`${url}whoami`);
  }

  login(username: string, password: string): Observable<Auth> {

    const options = {
      headers: {
        'auth-username': username,
        'auth-password': password
      }
    };

    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
    return this.http.get<Auth>(`${url}whoami`, options).pipe(
      map(auth => {
        if (auth && auth.computedToken) {
          this._auth = auth;
          if (isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem('authToken', auth.computedToken);
          }
        } else {
          this._auth = null;
        }

        this._authUpdate.next(this._auth);
        return this._auth;
      })
    );
  }

  getAuth(): Observable<Auth> {
    return new Observable(observer => {

      if (this._auth != null) {
        observer.next(this._auth);
      } else if (!this.isLoading) {
        this.isLoading = true;
        this.fetchAuth().pipe(take(1)).subscribe(auth => {
          if (auth && auth.computedToken != null) {
            this._auth = auth;
          } else {
            this._auth = null;
          }
          observer.next(this._auth);
          this._authUpdate.next(this._auth);
          this.isLoading = false;
        }, error => {
          this.logout();
          this.isLoading = false;
        });
      }

      this._authUpdate.subscribe(auth => {
        observer.next(auth);
      }, error => {
        observer.next(null);
      });
    });
  }

  get auth(): Auth {
    return this._auth;
  }

  logout(): void {
    // if (
    //   !this.configService.configData
    //   || !this.configService.configData.apiBaseUrl
    //   || this.configService.configData.apiBaseUrl.startsWith('/')
    // ) {
    //   const url = (this.configService.configData && this.configService.configData.apiBaseUrl || '/') + 'logout';
    //   this.http.get(url).pipe(take(1)).subscribe(response => {}, error => {});
    // }
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem('authToken');
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
    this._auth = null;
    this._authUpdate.next(null);
  }

  public getUser(): string {
    if (this._auth && this._auth.identifier) {
      return this._auth.identifier;
    } else {
      return '';
    }
  }

  hasRoles(...roles: Array<Role|string>): boolean {
    const rolesList = [...roles];

    if (this._auth && this._auth.roles && rolesList && rolesList.length) {
      for (let i = 0; i < rolesList.length; i++) {
        let role = rolesList[i].charAt(0).toLowerCase() + rolesList[i].slice(1);
        role = role.charAt(0).toUpperCase() + role.slice(1);
        if (this._auth.roles.indexOf(role as Role) === -1) {
          return false;
        }
      }
    } else {
      return false;
    }
    return true;
  }

  hasRolesAsync(...roles: Array<Role|string>): Observable<boolean> {
    return new Observable(observer => {
      if (this.auth != null) {
        observer.next(this.hasRoles(...roles));
        observer.complete();
      } else {
        this.getAuth().pipe(take(1)).subscribe(auth => {
          observer.next(this.hasRoles(...roles));
          observer.complete();
        });
      }
    });
  }

  hasAnyRoles(...roles: Array<Role|string>): boolean {
    const rolesList = [...roles];
    if (this._auth && this._auth.roles && rolesList && rolesList.length) {
      for (let i = 0; i < rolesList.length; i++) {
        let role = rolesList[i].charAt(0).toLowerCase() + rolesList[i].slice(1);
        role = role.charAt(0).toUpperCase() + role.slice(1);
        if (this._auth.roles.indexOf(role as Role) > -1) {
          return true;
        }
      }
    } else {
      return false;
    }
    return false;
  }

  hasAnyRolesAsync(...roles: Array<Role|string>): Observable<boolean> {
    return new Observable(observer => {
      if (this.auth != null) {
        observer.next(this.hasAnyRoles(...roles));
        observer.complete();
      } else {
        this.getAuth().pipe(take(1)).subscribe(auth => {
          observer.next(this.hasAnyRoles(...roles));
          observer.complete();
        });
      }
    });
  }
}
