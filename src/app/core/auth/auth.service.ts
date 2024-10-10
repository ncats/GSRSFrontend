import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { Auth, Role, UserGroup } from './auth.model';
import { Observable, Subject, of } from 'rxjs';
import { map, take, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { UserDownload, AllUserDownloads } from '@gsrs-core/auth/user-downloads/download.model';

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
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isLoading = true;
    /*
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
    */
    configService.afterLoad().then(cs => {
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
    });
  }

  get auth(): Auth {
    return this._auth;
  }

  public checkAuth(): Observable<Auth> {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/'}api/v1/`;
    if (this.configService.configData && this.configService.configData.dummyWhoami) {
      return of(this.configService.configData.dummyWhoami);
    } else {
      return this.http.get<any>(`${url}whoami`);
    }
  }

  login(username: string, password: string): Observable<Auth> {

    const options = {
      headers: {
        'auth-username': username,
        'auth-password': password
      }
    };

    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/'}api/v1/`;

    let obs = this.http.get<Auth>(`${url}whoami`, options);
    if (this.configService.configData && this.configService.configData.dummyWhoami) {
      obs = of(this.configService.configData.dummyWhoami);
    }
    return obs.pipe(
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
        try {
          observer.next(auth);
        } catch (e) {
          console.log("Error calling observer");
        }
      }, error => {
        console.log("Error calling observer, registered error");
        try {
          observer.next(null);
        } catch (e) {
          console.log("Error calling observer, registered error, passed null");
        }
      });
      /*
      this._authUpdate.subscribe(auth => {
        observer.next(auth);
      }, error => {
        observer.next(null);
      });
      */
    });
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
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
    const url = `${this.configService.configData.apiBaseUrl}logout`;
    this.http.get(url).subscribe(() => {
      this._auth = null;
      this._authUpdate.next(null);
    }, error => {
      this._auth = null;
      this._authUpdate.next(null);
    });
  }

  public getUser(): string {
    if (this._auth && this._auth.identifier) {
      return this._auth.identifier;
    } else {
      return '';
    }
  }

  hasRoles(...roles: Array<Role | string>): boolean {
    const rolesList = [...roles];

    if (this._auth && this._auth.roles && rolesList && rolesList.length) {
      for (const r of rolesList) {
        let role = r.charAt(0).toLowerCase() + r.slice(1);
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

  isInGroups(...group: Array<any | string>): boolean {
    const groupList = [...group];

    if (this._auth && this._auth.groups && groupList && groupList.length) {
      for (const r of groupList) {
        let role = r.charAt(0).toLowerCase() + r.slice(1);
        role = role.charAt(0).toUpperCase() + role.slice(1);
        this._auth.groups.forEach(group => {
          if (group.name === role) {
            return true;
          }
        });
      }
      return false;
    } else {
      return false;
    }
    return true;
  }

  hasRolesAsync(...roles: Array<Role | string>): Observable<boolean> {
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

  hasAnyRoles(...roles: Array<Role | string>): boolean {
    const rolesList = [...roles];
    if (this._auth && this._auth.roles && rolesList && rolesList.length) {
      for (const r of rolesList) {
        let role = r.charAt(0).toLowerCase() + r.slice(1);
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

  hasAnyRolesAsync(...roles: Array<Role | string>): Observable<boolean> {
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

  startUserDownload(fullUrl: string, privateExport: boolean, filename?: string, id?: string): Observable<any> {

    let params = new HttpParams();

    if (privateExport) {
      params = params.append('publicOnly', 'false');
    }
    if (filename && filename !== '') {
      params = params.append('filename', filename);
    }
    if (id) {
      params = params.append('exportConfigId', id);
    }

    const options = {
      params: params
    };

    return this.http.get<any>(fullUrl, options);
  }

  getUpdateStatus(id: string): Observable<UserDownload> {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/'}api/v1/`;
    return this.http.get<any>(`${url}profile/downloads/${id}`);
  }

  changeDownload(url: string): Observable<UserDownload> {
    return this.http.get<any>(url);
  }

  deleteDownload(url: string): any {
    return this.http.delete<any>(url, { observe: 'response' });
  }

  getAllDownloads(): Observable<AllUserDownloads> {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/'}api/v1/`;
    return this.http.get<any>(`${url}profile/downloads`);

  }

  private fetchAuth(): Observable<Auth> {
    return new Observable(observer => {
      this.configService.afterLoad().then(cd => {
        const isPfdaVersion = this.configService.configData.isPfdaVersion === true;
        const url = isPfdaVersion ? '/api/user' :
          `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/'}api/v1/whoami`;
        if (this.configService.configData && this.configService.configData.dummyWhoami) {
          observer.next(this.configService.configData.dummyWhoami);
        } else {
          this.http.get<Auth>(url)
          .subscribe(
            auth => {
             if (isPfdaVersion) {
               // @ts-ignore
               const dxuser = auth.user.dxuser;
               const pfdaAuth: Auth = {
                 id: 0,
                 version: 0,
                 created: 0,
                 modified: 0,
                 deprecated: false,
                 user: {
                   id: 0,
                   version: 0,
                   created: 0,
                   modified: 0,
                   deprecated: false,
                   username: dxuser,
                   email: auth.user.email,
                   admin: auth.user.admin
                 },
                 active: true,
                 systemAuth: false,
                 key: 'unused',
                 identifier: dxuser,
                 groups: [],
                 roles: [
                   "Query",
                   "Updater",
                   "SuperUpdate",
                   "DataEntry",
                   "SuperDataEntry"
                 ],
                 computedToken: 'unused',
                 tokenTimeToExpireMS: 9999999999999,
                 roleQueryOnly: false,
                 permissions: []
               }
               observer.next(pfdaAuth);
             } else {
               observer.next(auth);
             }
            },
            err => {
              console.log("Authorized error");
              console.log(err);
              observer.error(err);
            },
            () => observer.complete()
          );
        }
      });
    });
  }

  /*
  private fetchAuth(): Observable<Auth> {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/'}api/v1/`;
    return this.http.get<Auth>(`${url}whoami`);
  }
  */
}
