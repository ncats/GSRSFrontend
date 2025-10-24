import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {Location} from '@angular/common';
import { AuthService } from '@gsrs-core/auth/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  activeTab: number;
  current: string;
  lastTab: number;
  canManageCVs: boolean = false;
  canRunJobs: boolean = false;
  canImportData: boolean =false;
  canManageUsers: boolean = false;
  canViewServerFiles:boolean = false;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    console.log(`in admin.component ngOnInit`);
    await this.checkPrivileges();
    
    this.activatedRoute.params.subscribe(routeParams => {
      this.current = routeParams.function;
      console.log(`routeParams.function: ${routeParams.function}`);
      switch (this.current) {
        case 'cache': this.activeTab = 0; break;
        case 'info': 
           this.activeTab = 1; break;
        case 'user':
          if(!this.canManageUsers){
            console.log("user does not have privs to manage users");
            this.activeTab=-1;
            break;
          }
           this.activeTab = 2; break;
        case 'import': 
          if( !this.canImportData ) {
            console.log("user does not have privs to import data");
            this.activeTab=-1;
            break;
          }
          this.activeTab = 3;
          break;
         
        case 'cv': 
          if( !this.canManageCVs ) {
            console.log("user does not have privs to manage CVs");
            this.activeTab=-1;
            break;
          }
          this.activeTab = 4; 
          break;
        
        case 'jobs':
          if(!this.canRunJobs){
            console.log("user does not have privs to run jobs");
            this.activeTab=-1;
            break;
          }
           this.activeTab = 5; break;
        case 'files':
          if( !this.canViewServerFiles){
            console.log("user does not have privs to view server files");
            this.activeTab=-1;
            break;
          } this.activeTab = 6; break;
        case 'data':
          if( !this.canImportData){
            console.log("user does not have privs to import data");
            this.activeTab=-1;
            break;
          }
          this.activeTab = 7; break;

        default: this.activeTab = 0; break;
    }
    if( this.activeTab <= -1) {
        this.router.navigate(['/home' ] );
    }
    });
    const tab = this.activatedRoute.snapshot.queryParams['function'] || 'cache';
  console.log('ngoninit complete at ' + (new Date()));
}

async checkPrivileges() {
  this.canManageCVs = await this.authService.hasSpecificPrivilege("Manage CVs");
  this.canRunJobs = await this.authService.hasSpecificPrivilege("Run Tasks");
  this.canImportData= await this.authService.hasSpecificPrivilege("Import Data");
  this.canManageUsers = await this.authService.hasSpecificPrivilege("Manage Users");
  this.canViewServerFiles = await this.authService.hasSpecificPrivilege("View Files");
  console.log('checkPrivileges complete');
}

  onTabChanged(event: MatTabChangeEvent): void {

    console.log(`starting onTabChanged at ` + (new Date()));
    let route = 'cache';

    switch (event.index) {
      case 0:
        break;
        case 1:
      route = 'info';
        break;
        case 2:
      route = 'user';
        break;
      case 3:
        route = 'import';
      break;
      case 4:
        route = 'cv';
      break;
      case 5:
        route = 'jobs';
      break;
      case 6:
        route = 'files';
      break;
      case 7:
        route = 'data';
      break;
    }
    if( this.current !== route){
      if (this.current !== 'jobs') {
        this.current = route;
        this.router.navigate(['/admin/' + route] );
      } else {
        this.current = route;
        this.activeTab = 0;
        this.router.navigate(['/admin/' + route] );
      }
    } else {
      console.log('already on the desired tab!');
    }

  }
}
