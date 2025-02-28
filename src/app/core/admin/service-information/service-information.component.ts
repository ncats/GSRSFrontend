import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-service-information',
  templateUrl: './service-information.component.html',
  styleUrls: ['./service-information.component.scss']
})
export class ServiceInformationComponent implements OnInit {

    loading: boolean;
    currentService = ""; 
    services = ["frontend", "gateway", "clinical-trials", "substances" ];
    currentEndpoint = "";
    endpoints = [];
    text= "";
    textAreaDisabled=true;

  constructor(
    private adminService: AdminService
  ) { }
     onServiceSelectionChange(event: MatSelectChange) {
      this.currentService=event.value;
      this.currentEndpoint = "";
      this.endpoints = [];
      this.text= "";
      this.adminService.fetchServiceInfoEndpointPaths(this.currentService).pipe(take(1)).subscribe( resp => {
        this.loading = false;
        this.endpoints = resp.endpoints;
      });
    }

 
    onEndpointSelectionChange(event: MatSelectChange) {
      this.adminService.fetchServiceInfoByEndpoint(this.currentEndpoint).pipe(take(1)).subscribe( resp => {
        this.text = JSON.stringify(resp, null, 2);
      });
    }
  
    onEndpointSelectionChange2(event: MatSelectChange) {
      let responseType="json";
      if (this.currentEndpoint.indexOf("fmt=text")>0) {
        responseType="text";
      }
      this.adminService.fetchServiceInfoByEndpoint2(this.currentEndpoint, responseType).subscribe( resp => {
        if(resp.headers.get('content-type')=="text/plain") { 
           this.text = resp.body;
        } else {
          this.text = JSON.stringify(resp.body, null, 2);
        }
      });
    }

  ngOnInit() {
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
