import { Injectable, PLATFORM_ID, Inject, signal, computed } from "@angular/core";
import { ConfigService } from "../config/config.service";
import { Auth, Privilege, Role, UserGroup } from "./auth.model";
import {
  interval,
  from,
  Observable,
  BehaviorSubject,
  of,
  firstValueFrom,
  throwError,
} from "rxjs";
import {
  map,
  take,
  catchError,
  concat,
  switchMap,
  tap,
  takeWhile,
  filter,
  concatMap,
} from "rxjs/operators";
import { HttpClient, HttpParams } from "@angular/common/http";
import { isPlatformBrowser } from "@angular/common";
import {
  UserDownload,
  AllUserDownloads,
} from "@gsrs-core/auth/user-downloads/download.model";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _auth: Auth | null;
  private _authUpdate = new BehaviorSubject<Auth | null>(null);
  private isLoading: boolean;
  private _privileges: Array<Privilege> = [];

  // Signal mirrors for OnPush consumers; writable state stays private.
  private readonly _authState = signal<Auth | null>(null);
  private readonly _privilegesSignal = signal<Array<Privilege>>([]);
  private readonly _authLoading = signal<boolean>(true);
  readonly authState = this._authState.asReadonly();
  readonly privileges = this._privilegesSignal.asReadonly();
  readonly authLoading = this._authLoading.asReadonly();
  readonly canEdit = computed(() => this.hasPrivilege("Edit"));

  constructor(
    public configService: ConfigService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
    this.isLoading = true;
    this._authLoading.set(true);
    configService.afterLoad().then((cs) => {
      this.fetchAuth()
        .pipe(
          take(1),
          switchMap((auth) => {
            if (auth && auth.computedToken != null) {
              this.setAuthState(auth);
              // Fetch privileges AFTER successful auth
              return this.fetchPrivs();
            } else {
              this.setAuthState(null);
              return of([]);
            }
          }),
        )
        .subscribe({
          next: (privs) => {
            this.setPrivileges(privs);
            console.log("Privs", privs)
            this.isLoading = false;
            this._authLoading.set(false);
          },
          error: (err) => {
            console.error("Error:", err);
            this.setAuthState(null);
            this.isLoading = false;
            this._authLoading.set(false);
          },
        });
    });
  }

  private setAuthState(auth: Auth | null): void {
    this._auth = auth;
    this._authUpdate.next(this._auth);
    this._authState.set(auth);
    // Avoid carrying privileges across auth transitions.
    this.setPrivileges([]);
  }

  private setPrivileges(privileges: Privilege[]): void {
    this._privileges = privileges;
    this._privilegesSignal.set(privileges);
  }

  hasPrivilege(name: string): boolean {
    return this.privileges().some((p) => p.privilege === name);
  }

  get auth(): Auth | null {
    return this._auth;
  }

  public checkAuth(): Observable<Auth> {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || "/"}api/v1/`;
    if (
      this.configService.configData &&
      this.configService.configData.dummyWhoami
    ) {
      return of(this.configService.configData.dummyWhoami);
    } else {
      return this.http.get<any>(`${url}whoami`);
    }
  }

  login(username: string, password: string): Observable<Auth> {
    const options = {
      headers: {
        "auth-username": username,
        "auth-password": password,
      },
    };

    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || "/"}api/v1/`;

    let obs = this.http.get<Auth>(`${url}whoami`, options);
    if (
      this.configService.configData &&
      this.configService.configData.dummyWhoami
    ) {
      obs = of(this.configService.configData.dummyWhoami);
    }
    return obs.pipe(
      switchMap((auth) => {
        if (auth && auth.computedToken) {
          if (isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem("authToken", auth.computedToken);
          }
          this.setAuthState(auth);
          // Fetch privileges after successful login
          return this.fetchPrivs().pipe(
            map(() => this._auth),
            catchError(() => {
              // Privileges fetch failed, but auth succeeded - still return auth
              return of(this._auth);
            }),
          );
        } else {
          this.setAuthState(null);
          return of(null);
        }
      }),
    );
  }

  // Helper function to create an Observable that emits when the popup login window closes
  private waitForPopupToClose(popupWindow: Window): Observable<number> {
    return interval(1000).pipe(
      takeWhile(() => !popupWindow.closed, true),
      filter(() => popupWindow.closed),
    );
  }

  // Method to handle pFDA login (using popup window) and return success/unsuccess flag
  pfdaLogin(): Observable<boolean> {
    const height = 700;
    const width = 700;
    const left = screen.width / 2 - width / 2;
    const top = screen.height / 2 - height / 2;
    const loginWindow = window.open(
      "/login?force_fda_sso_login=true&user_return_to=%2Fginas%2Fclose-pfda-login-window",
      "pFDA Login",
      `height=${height},width=${width},top=${top},left=${left}`,
    );

    return this.waitForPopupToClose(loginWindow).pipe(
      concatMap(() =>
        this.getAuth().pipe(
          map((authAfterLogin) => !!authAfterLogin), // Convert to boolean (true = success)
          catchError(() => of(false)), // Return false if there's an error
        ),
      ),
    );
  }

  getAuth(): Observable<Auth | null> {
    // Trigger a fetch if not loading and no auth yet
    if (this._auth == null && !this.isLoading) {
      this.isLoading = true;
      this._authLoading.set(true);
      this.fetchAuth()
        .pipe(take(1))
        .subscribe({
          next: (auth) => {
            this.setAuthState(auth?.computedToken ? auth : null);
            this.isLoading = false;
            this._authLoading.set(false);
          },
          error: () => {
            this.setAuthState(null);
            this.isLoading = false;
            this._authLoading.set(false);
          },
        });
    }

    // Return the BehaviorSubject as observable - late subscribers get current value
    return this._authUpdate.asObservable();
  }

  private deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }

  logout(): void {
    this.setPrivileges([]);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem("authToken");
      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
    let url = `${this.configService.configData.apiBaseUrl}logout`;
    let method = "GET";

    if (this.configService.configData.isPfdaVersion) {
      url = "/logout";
      method = "DELETE";
    }

    this.http.request(method, url).subscribe(
      () => {
        this.setAuthState(null);
        this.deleteCookie("sessionExpiredAt");
      },
      (error) => {
        this.setAuthState(null);
        this.deleteCookie("sessionExpiredAt");
      },
    );
  }

  public getUser(): string {
    if (this._auth && this._auth.identifier) {
      return this._auth.identifier;
    } else {
      return "";
    }
  }

  hasRoles(...roles: Array<string>): boolean {
    const rolesList = [...roles];

    if (this._auth && this._auth.roles && rolesList && rolesList.length) {
      const checkableRoles = this._auth.roles.map((x: Role) =>
        x.role.toUpperCase(),
      );
      for (const r of rolesList) {
        let role = r.toUpperCase();
        if (checkableRoles.indexOf(role) === -1) {
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
        this._auth.groups.forEach((group) => {
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

  hasRolesAsync(...roles: Array<string>): Observable<boolean> {
    return new Observable((observer) => {
      if (this.auth != null) {
        observer.next(this.hasRoles(...roles));
        observer.complete();
      } else {
        this.getAuth()
          .pipe(take(1))
          .subscribe((auth) => {
            observer.next(this.hasRoles(...roles));
            observer.complete();
          });
      }
    });
  }

  hasAnyRoles(...roles: Array<string>): boolean {
    const rolesList = [...roles];

    if (this._auth && this._auth.roles && rolesList && rolesList.length) {
      const checkableRoles = this._auth.roles.map((x: Role) =>
        x.role.toUpperCase(),
      );
      for (const r of rolesList) {
        let role = r.toUpperCase();
        if (checkableRoles.indexOf(role) === -1) {
          return true;
        }
      }
    } else {
      return false;
    }
    return false;
  }

  async canEditData(): Promise<boolean> {
    return this.hasSpecificPrivilege("Edit");
  }

  async hasAnyPrivilege(...privs): Promise<boolean> {
    await this.ensurePrivilegesLoaded();
    return privs.some((p) =>
      this._privileges.some(
        (pp) => pp.privilege.toUpperCase() == p.toUpperCase(),
      ),
    );
  }

  private async ensurePrivilegesLoaded(): Promise<void> {
    if (!this._privileges || this._privileges.length === 0) {
      try {
        // fetchPrivs() already calls setPrivileges() internally on success.
        await firstValueFrom(this.fetchPrivs());
      } catch (e) {
        // Not authenticated or fetch failed - use empty privileges
        this.setPrivileges([]);
      }
    }
  }

  async hasSpecificPrivilege(requestedPrivilege: string): Promise<boolean> {
    await this.ensurePrivilegesLoaded();
    return (
      this._privileges != null &&
      this._privileges.some((p) => p.privilege == requestedPrivilege)
    );
  }

  hasAnyRolesAsync(...roles: Array<string>): Observable<boolean> {
    return new Observable((observer) => {
      if (this.auth != null) {
        observer.next(this.hasAnyRoles(...roles));
        observer.complete();
      } else {
        this.getAuth()
          .pipe(take(1))
          .subscribe((auth) => {
            observer.next(this.hasAnyRoles(...roles));
            observer.complete();
          });
      }
    });
  }

  startUserDownload(
    fullUrl: string,
    privateExport: boolean,
    filename?: string,
    id?: string,
  ): Observable<any> {
    let params = new HttpParams();

    if (privateExport) {
      params = params.append("publicOnly", "false");
    }
    if (filename && filename !== "") {
      params = params.append("filename", filename);
    }
    if (id) {
      params = params.append("exportConfigId", id);
    }

    const options = {
      params: params,
    };

    return this.http.get<any>(fullUrl, options);
  }

  getUpdateStatus(id: string): Observable<UserDownload> {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || "/"}api/v1/`;
    return this.http.get<any>(`${url}profile/downloads/${id}`);
  }

  changeDownload(url: string): Observable<UserDownload> {
    return this.http.get<any>(url);
  }

  deleteDownload(url: string): any {
    return this.http.delete<any>(url, { observe: "response" });
  }

  getAllDownloads(): Observable<AllUserDownloads> {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || "/"}api/v1/`;
    return this.http.get<any>(`${url}profile/downloads`);
  }

  private fetchAuth(): Observable<Auth> {
    return new Observable((observer) => {
      this.configService.afterLoad().then((cd) => {
        const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || "/"}api/v1/`;
        if (
          this.configService.configData &&
          this.configService.configData.dummyWhoami
        ) {
          observer.next(this.configService.configData.dummyWhoami);
        } else {
          this.http.get<Auth>(`${url}whoami`).subscribe(
            (auth) => {
              //  console.log("Authorized as");
              //  console.log(auth);
              observer.next(auth);
            },
            (err) => {
              console.log("Authorized error");
              observer.error(err);
            },
            () => observer.complete(),
          );
        }
      });
    });
  }

  private fetchPrivs(): Observable<Privilege[]> {
    return from(this.configService.afterLoad()).pipe(
      switchMap(() => {
        const baseUrl = this.configService.configData?.apiBaseUrl || "/";
        const url = `${baseUrl}api/v1/allmyprivs`;
        return this.http.get<any>(url);
      }),
      map((response) => {
        const privs: Privilege[] = response.privileges.map((p) => ({
          privilege: p,
        }));
        this.setPrivileges(privs);
        return privs;
      }),
      catchError((err) => {
        console.error("Authorized error", err);
        return throwError(() => err);
      }),
    );
  }
}
