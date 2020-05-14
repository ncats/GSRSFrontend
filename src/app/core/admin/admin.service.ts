import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { BaseHttpService } from '../base/base-http.service';
import { Observable, Subject, forkJoin, throwError } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { PagingResponse } from '../utils/paging-response.model';
import { map, catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  public fetchJobs(): Observable<any> {
    console.log('getting all');
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
    return this.http.get<any>(`${url}scheduledjobs`);
  }

  public fetchJob(id: string): Observable<any> {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
    // console.log(`${url}scheduledjobs(${id})`);
    return this.http.get<any>(`${url}scheduledjobs(${id})`);

  }

  public runJob(job: string): Observable<any> {
    console.log(job);
    if(!job){
      job = "http://localhost:9000/ginas/app/api/v1/scheduledjobs(1)/$@cancel"
    }
    return this.http.get<any>(job).pipe(retry(2), catchError(err => {console.log(err); return throwError(err)}));
      }


    public getEnvironmentHealth(): Observable<any> {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.get<any>(`${url}health/info`);

    }

    public getUserByID(id:number): Observable<any> {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.get<any>(`${url}users/${id}`);
    }
    public getUserByName(name:string): Observable<any> {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.get<any>(`${url}users/${encodeURIComponent(name)}`);
    }

    public getAllUsers(): Observable<any> {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.get<any>(`${url}users`);
    }

    public editUser(user: any, name: any): Observable<any> {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.put<any>(`${url}users/${name}`, user);
    }
    public addUser(user: any): Observable<any> {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.post<any>(`${url}users/`, user);
    }

    public getGroups(): Observable<any> {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.get<any>(`${url}admin/groups/@names`);
    }


    public changePassword(oldpass: string, newpass: string, id:number): Observable<any> {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      let params = new HttpParams();
        params = params.append(
          'oldPassword', oldpass
        );
        params = params.append(
          'newPassword', newpass
        );
      return this.http.post<any>(`${url}users/${id}/password`, params);
      }




}