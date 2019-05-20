import { Injectable } from '@angular/core';
import { BaseHttpService } from '../base/base-http.service';
import { ConfigService } from '../config/config.service';
import { Auth, Role } from './auth.model';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseHttpService {
  private _auth: Auth;
  private _authUpdate: Subject<Auth> = new Subject();
  private isLoading: boolean;

  constructor(
    public configService: ConfigService,
    private http: HttpClient
  ) {
    super(configService);
    this.isLoading = true;
    this.fetchAuth().subscribe(auth => {
      this._auth = auth;
      this._authUpdate.next(auth);
      this.isLoading = false;
    }, error => {
      this._authUpdate.next(null);
      this.isLoading = false;
    });
  }

  private fetchAuth(): Observable<Auth> {
    return this.http.get<Auth>(`${this.apiBaseUrl}whoami`);
  }

  login(username: string, password: string): Observable<Auth> {

    const options = {
      headers: {
        'auth-username': username,
        'auth-password': password
      }
    };

    return this.http.get<Auth>(`${this.apiBaseUrl}whoami`, options).pipe(
      map(auth => {
        if (auth && auth.computedToken) {
          sessionStorage.setItem('authToken', auth.computedToken);
        }
        this._auth = auth;
        this._authUpdate.next(auth);
        return auth;
      })
    );
  }

  getAuth(): Observable<Auth> {
    return new Observable(observer => {

      if (this._auth != null) {
        observer.next(this._auth);
      } else if (!this.isLoading) {
        this.isLoading = true;
        this.fetchAuth().subscribe(auth => {
          this._auth = auth;
          observer.next(this._auth);
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
    if (
      !this.configService.configData
      || !this.configService.configData.apiBaseUrl
      || this.configService.configData.apiBaseUrl.startsWith('/')
    ) {
      const url = (this.configService.configData && this.configService.configData.apiBaseUrl || '/') + 'logout';
      this.http.get(url).subscribe();
    }
    sessionStorage.removeItem('authToken');
    this._auth = null;
    this._authUpdate.next(null);
  }

  hasRoles(...roles: Array<Role|string>): boolean {
    const rolesList = [...roles];

    if (this._auth && this._auth.roles && rolesList && rolesList.length) {
      for (let i = 0; i < rolesList.length; i++) {
        let role = rolesList[i].toLowerCase();
        role = role.charAt(0).toUpperCase() + role.slice(1);
        if (!this._auth.roles.includes(role as Role)) {
          return false;
        }
      }
    } else {
      return false;
    }
    return true;
  }
}
