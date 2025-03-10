import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { ConfigService } from '@gsrs-core/config/config.service';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-service-information',
  templateUrl: './service-information.component.html',
  styleUrls: ['./service-information.component.scss']
})
export class ServiceInformationComponent implements OnInit {

    loading: boolean;
    currentService = "";
    services = [];
    currentEndpoint = "";
    currentEndpointUrl: string = "";
    endpoints = [];
    content: any = "";
    displayAsJson = false;
    rawContent = false;
    textAreaDisabled=true;

  constructor(
    private adminService: AdminService,
    public configService: ConfigService
  ) { }
     onServiceSelectionChange(event: MatSelectChange) {
      this.currentService=event.value;
      this.currentEndpoint = "";
      this.currentEndpointUrl="";
      this.endpoints = [];
      this.content= "";
      this.adminService.fetchServiceInfoEndpointPaths(this.currentService).pipe(take(1)).subscribe( resp => {
        this.loading = false;
        this.endpoints = resp.endpoints;
      });
    }

    onEndpointSelectionChange(event: MatSelectChange) {
      this.currentEndpointUrl  = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }` + this.currentEndpoint;
      let responseType="json";
      if (this.currentEndpoint.indexOf("fmt=text")>0) {
        responseType="text";
      }
      this.adminService.fetchServiceInfoByEndpoint(this.currentEndpoint, responseType).subscribe( resp => {
        if (resp=='error') {
          this.displayAsJson = false;
          this.content = "There was an error when getting this endpoint.";
        } else {
          const ct = resp.headers.get('content-type');
          if(ct.toLowerCase().indexOf('text/plain')>-1) {
            this.displayAsJson = false;
            this.content = resp.body;
          } else if (!this.isJsonFriendly(resp.body)) {
            this.displayAsJson = false;
            this.content = "Problem parsing JSON.";
          } else {
            this.displayAsJson = true;
            this.content = resp.body;
          }
        }
      });
    }

    isJsonFriendly(object: any) {
      try {
          JSON.parse(JSON.stringify(object));
      } catch (e) {
          return false;
      }
      return true;
  }


    onRawCheckboxChange(event: MatCheckboxChange) {
      this.rawContent = event.checked;
    }

    ngOnInit() {
      let activeServices = _.filter(this.configService.configData?.services || [], {  'active': true });
      this.services = _.map(activeServices, "name", ).sort();
      this.loading = false;
      if(this.currentService) {
        setTimeout(() => {
          this.adminService.fetchServiceInfoEndpointPaths(this.currentService).pipe(take(1)).subscribe( resp => {
            this.loading = false;
            this.endpoints = resp.endpoints;
          });
        }, 1000);
      }
    }

}
