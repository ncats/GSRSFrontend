import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { BaseHttpService } from '../base/base-http.service';
import { Observable, Subject, forkJoin, throwError } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { PagingResponse } from '../utils/paging-response.model';
import { map, catchError, retry } from 'rxjs/operators';
import { FacetHttpParams } from '@gsrs-core/facets-manager';
import { ScheduledJob } from '@gsrs-core/admin/scheduled-jobs/scheduled-job.model';
import { Auth } from '@gsrs-core/auth';
import { UserEditObject } from '@gsrs-core/admin/admin-objects.model';


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

  public fetchJobs():Observable< any > {
    console.log('getting all');
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
    return this.http.get< any >(`${url}scheduledjobs`);
  }

  public fetchJob(id: number): Observable< ScheduledJob > {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
    return this.http.get< any >(`${url}scheduledjobs(${id})`);

  }

  public runJob(job: string): Observable< ScheduledJob > {
    return this.http.get< ScheduledJob >(job).pipe(retry(2), catchError(err => {return throwError(err)}));
      }


    public getEnvironmentHealth(): Observable< any > {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.get< any >(`${url}health/info`);

    }

    public getUserByID(id:number): Observable< Auth > {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.get< Auth >(`${url}users/${id}`);
    }
    public getUserByName(name:string): Observable< Auth > {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.get< Auth >(`${url}users/${encodeURIComponent(name)}`);
    }

    public getAllUsers(): Observable< any > {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.get< any >(`${url}users`);
    }

    public editUser(user: UserEditObject, name: string): Observable< Auth > {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.put< Auth >(`${url}users/${name}`, user);
    }

    public addUser(user: UserEditObject): Observable< Auth > {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.post< Auth >(`${url}users/`, user);
    }

    public deleteUser(user: string): Observable< Auth > {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.delete< Auth >(`${url}users/${user}`);
    }

    public getGroups(): Observable< any > {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.get< any >(`${url}admin/groups/@names`);
    }


    public changePassword(oldpass: string, newpass: string, id:number): Observable< any > {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
        let body3 = {}
        body3['oldPassword'] = oldpass;
        body3['newPassword'] = newpass;
      return this.http.post< any >(`${url}users/${id}/password`, body3);
      }

      public changeMyPassword(oldpass: string, newpass: string, id:number): Observable< any > {
        const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
          let body3 = {}
          body3['oldPassword'] = oldpass;
          body3['newPassword'] = newpass;
        return this.http.post< any >(`${url}users/${id}/password`, body3);
        }

}
