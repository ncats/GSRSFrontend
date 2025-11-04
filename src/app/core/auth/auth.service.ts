import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { Auth, Privilege, Role, UserGroup } from './auth.model';
import { from, Observable, Subject, throwError, of, firstValueFrom } from 'rxjs';
import { map, take, catchError, concat, switchMap, tap } from 'rxjs/operators';
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
  private _privileges: Array<Privilege> = [];

  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
      this.isLoading = true;
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
      this.fetchPrivs().subscribe({
          next: privs => {
            this._privileges = privs;
          },
          error: err=>{
            console.error('Error fetching privileges:', err);
          },
          complete: () => {
            return this._privileges;
          }
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
    });
  }

  logout(): void {
    this._privileges = [];
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

  async canEditData( ):Promise<boolean> {
    if( this._privileges == null || this._privileges.length === 0) {
      const privs = await firstValueFrom(this.fetchPrivs());
      return privs.some(p => p.privilege === 'Edit');
    }
    return this._privileges != null && this._privileges.some(p=>p.privilege=="Edit");
  }

  async hasAnyPrivilege(...privs) : Promise< boolean> {
    if( this._privileges == null || this._privileges.length === 0) {
      const privs = await firstValueFrom(this.fetchPrivs());
    }
    return privs.some(p=>this._privileges.some(pp=>pp.privilege.toUpperCase()== p.toUpperCase()));
  }
  
  async hasSpecificPrivilege(requestedPrivilege: string ):Promise<boolean> {
    if( this._privileges == null || this._privileges.length === 0) {
      const privs = await firstValueFrom(this.fetchPrivs());
      return privs.some(p => p.privilege === requestedPrivilege);
    }
    return this._privileges != null && this._privileges.some(p=>p.privilege==requestedPrivilege);
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
        const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/'}api/v1/`;
        if (this.configService.configData && this.configService.configData.dummyWhoami) {
          observer.next(this.configService.configData.dummyWhoami);
        } else {
        this.http.get<Auth>(`${url}whoami`)
          .subscribe(
            auth => {
              observer.next(auth);
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
  
private fetchPrivs(): Observable<Privilege[]> {
  return from(this.configService.afterLoad()).pipe(
    switchMap(() => {
      const baseUrl = this.configService.configData?.apiBaseUrl || '/';
      const url = `${baseUrl}api/v1/allmyprivs`;
      return this.http.get<any>(url);
    }),
    map(response => {
      const privs: Privilege[] = response.privileges.map(p => ({ privilege: p }));
      this._privileges = privs;
      return privs;
    }),
    catchError(err => {
      console.error("Authorized error", err);
      return throwError(() => err);
    })
  );
}

}
