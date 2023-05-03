import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpParameterCodec } from '@angular/common/http';
import { BaseHttpService } from '../base/base-http.service';
import { Observable, Subject, forkJoin, throwError } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { PagingResponse } from '../utils/paging-response.model';
import { map, catchError, retry } from 'rxjs/operators';
import { FacetHttpParams } from '@gsrs-core/facets-manager';
import { ScheduledJob } from '@gsrs-core/admin/scheduled-jobs/scheduled-job.model';
import { Auth } from '@gsrs-core/auth';
import { UserEditObject, UploadObject, DirectoryFile } from '@gsrs-core/admin/admin-objects.model';
class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

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

  

  public fetchJobs(): Observable< any > {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
    return this.http.get< any >(`${url}scheduledjobs`);
  }

  public fetchJob(id: number): Observable< ScheduledJob > {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
    return this.http.get< any >(`${url}scheduledjobs(${id})`);

  }

  public runJob(job: string): Observable< ScheduledJob > {
    return this.http.get< ScheduledJob >(job).pipe(retry(2), catchError(err => throwError(err)));
      }


    public getEnvironmentHealth(): Observable< any > {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.get< any >(`${url}health/info`);

    }

    public getUserByID(id: any): Observable< Auth > {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.get< Auth >(`${url}users(${id})`);
    }
    public getUserByName(name: string): Observable< Auth > {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.get< Auth >(`${url}users(${name})`);
    }

    public getAllUsers(): Observable< any > {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.get< any >(`${url}users`);
    }

    public editUser(user: UserEditObject, name: string): Observable< Auth > {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      return this.http.put< Auth >(`${url}users(${name})`, user);
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


    public changePassword( newpass: string, id: number): Observable< any > {
      const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
      const body = {};
        body['newPassword'] = newpass;
      return this.http.post< any >(`${url}users/${id}/password`, body);
      }

      public changeMyPassword(oldpass: string, newpass: string, id: number): Observable< any > {
        const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
        const body3 = {};
          body3['oldPassword'] = oldpass;
          body3['newPassword'] = newpass;
        return this.http.post< any >(`${url}profile/password `, body3);
        }

        public loadData(form: any) {
          console.log(form);
          const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/admin/load`;
          return this.http.post< any >(url, form);
        }

        public queryLoad(id: string): Observable< UploadObject > {
          const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/jobs`;
          return this.http.get< any >(`${url}/${id}/`);
        }

        public getFiles(): Observable < Array< DirectoryFile >> {
          const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/admin/files`;
          return this.http.get< any >(`${url}`);
        }

        public getLogs(): Observable< Array< DirectoryFile >> {
          const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/admin/logs`;
          return this.http.get< any >(`${url}`);
        }

        public getDownloadLink(name: string): string {
            return `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/admin/files/${name}`;
        }

        public getAdapters(): Observable< UploadObject > {
          const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/import/adapters`;
          return this.http.get< any >(`${url}`);
        }

       /* public putAdapter(file: any): Observable< Auth > {
          const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/import`;
          return this.http.put< any >(`${url}`, file);
        }*/

        public previewAdapter(id: string, file: any, adapter?: any, limit?: any): Observable< any > {
          console.log(file);
          let url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/import/${id}/@preview`;
         if (limit) {
           if(limit === 'all') {
             limit = 500000
           }
            url += "?limit=" + limit;
          }
          return this.http.put< any >(`${url}`, file);
        }

        public executeAdapter(id: string, file: any, adapter?: any): Observable< any > {
          const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/import/${id}/@execute?adapter=${adapter}`;
          return this.http.post< any >(`${url}`, file);
        }

        public executeAdapterAsync(id: string, file: any, adapter?: any): Observable< any > {
          const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/import/${id}/@executeasync?adapter=${adapter}`;
          return this.http.post< any >(`${url}`, file);
        }

        public processingstatus(id: any) {
          const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/stagingArea/processingstatus(${id})`;
          return this.http.get< any >(`${url}`);

        }

        //http://localhost:8080/api/v1/substances/import(a446cea4-07ad-4a25-b117-c2e25fee9c9a)/@execute?adapter=SDF

        public postAdapterFile(file: any, adapter?: string, entityType?: string): Observable< UploadObject > {
          if (!entityType) {
            entityType = 'ix.ginas.models.v1.Substance';
          }
          if (!adapter) {
            adapter = 'SDF';
          }
          adapter = encodeURI(adapter);

          const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/import?adapter=${adapter}&entityType=${entityType}`;

          return this.http.post< any >(url, file);
        }


        public GetStagedData(index?: any) {
          let url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/import/data`;
          if(index) {
            url += `?skip=${index}`;
          }
          return this.http.get< any >(`${url}`);

        }
        public GetStagedRecord(id:string) {
          let url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/stagingArea/${id}`;
          
          return this.http.get< any >(`${url}`);

        }

        public SearchStagedData(skip: any, facets?: any, term?: any, top?: any) {
          let params = new FacetHttpParams({encoder: new CustomEncoder()});
          if (facets){
            params = params.appendFacetParams(facets, true);

          }
          if (term) {
            params = params.append('q',(term));
          }

          if (top) {
            params = params.append('top',(top));

          }

          const options = {
            params: params
          };
          let url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/stagingArea/search?skip=${skip}`;
          
          return this.http.get< any >(url, options);

        }

        public GetSingleUUID() {
          let url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/search?top=1`;
          return this.http.get< any >(url);
        }

        public stagedRecordAction(id:string, record: string, action: string) {
          let url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/import/${id}/0/@act?matchedEntityId=${record}&view=internal&persistChangedObject=true`;
          let toput = {};
          if (action === 'create') {
            toput = {
              "processingActions": [
                {
                  "processingActionClass": "gsrs.dataexchange.processing_actions.CreateProcessingAction"
                }
              ]
            };
          } else if (action === 'merge') {
            toput = {
              "processingActions": [
                {
                        "parameters": {
                  "MergeNames": true,
                            "MergeCodes": true
                  },
                  "processingActionClass": "gsrs.dataexchange.processing_actions.MergeProcessingAction"
                }
              ]
            }
          } else if (action === 'ignore') {
            toput = {
              "processingActions": [
                {
                  "processingActionClass": "gsrs.dataexchange.processing_actions.RejectProcessingAction"
                }
              ]
            }
          }
          return this.http.put< any >(url, toput);

        }

        public stagedRecordMultiAction(records:any, action: string, scrubber?: any) {
          console.log(records);
          console.log(scrubber);
          let url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/stagingArea/@bulkactasync?persistChangedObject=true`;
          let toput = {
            "stagingAreaRecords":
              records
            ,
              "processingActions": [
                {
                  "parameters": {

                  }, "processingActionName": action
                }
              ]
            }
            if (scrubber) {
              toput.processingActions[0].parameters['scrubberSettings'] = scrubber;
            }
            console.log(toput);
         
          return this.http.put< any >(url, toput);

        }

        public stagedRecordSingleAction(id:string, action: string, params?: any, matching?: string) {
          let url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/stagingArea/@bulkactasync?persistChangedObject=true`;
          let putParam = { "parameters": {}, "processingActionName": action};
          let putRecords = {}
          if (action === 'merge') {
            putParam.parameters['mergeSettings'] = params;
            putRecords = {'id': id, 'matchingID': matching }
          } else {
            putRecords = {'id': id}
          }
          let toput = {
            stagingAreaRecords: [
              putRecords
            ],
              "processingActions": [
                putParam
              ]
            }
            console.log
         
          return this.http.put< any >(url, toput);

        }

        getMergeActionSchema() {
          let url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/stagingArea/action(merge)/@schema`;

          return this.http.get< any >(url);

        }

        public updateStagingArea(id: string, substance: any) {
          let url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/stagingArea/${id}/@update`;

          return this.http.put< any >(url, substance);

        }

        public getImportScrubberSchema() {
          let url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/substances/stagingArea/action(Scrub)/@schema`;

          return this.http.get< any >(url);

        }
}
