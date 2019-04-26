import { Injectable } from '@angular/core';
import { BaseHttpService } from '../base/base-http.service';
import { ConfigService } from '../config/config.service';
import { Auth } from './auth.model';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseHttpService {
  private _auth: Auth;
  public authUpdate: Subject<Auth> = new Subject();
  private isLoading: boolean;

  constructor(
    public configService: ConfigService,
    private http: HttpClient
  ) {
    super(configService);
    this.isLoading = true;
    this.fetchAuth().subscribe(auth => {
      this._auth = auth;
      this.authUpdate.next(auth);
      this.isLoading = false;
    }, error => {
      this.authUpdate.next(null);
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
        this.authUpdate.next(auth);
        return auth;
      })
    );
  }

  getAuth(): Observable<Auth> {
    return new Observable(observer => {
      if (this._auth != null) {
        observer.next(this._auth);
        observer.complete();
      } else if (this.isLoading) {
        const subscription = this.authUpdate.subscribe(auth => {
          observer.next(auth);
          observer.complete();
          subscription.unsubscribe();
        }, error => {
          observer.next(null);
          observer.complete();
          subscription.unsubscribe();
        });
      } else {
        this.isLoading = true;
        this.fetchAuth().subscribe(auth => {
          this.authUpdate.next(auth);
          this.isLoading = false;
          observer.next(auth);
          observer.complete();
        }, error => {
          this.authUpdate.next(null);
          this.isLoading = false;
          observer.next(null);
          observer.complete();
        });
      }
    });
  }
}
