import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {Location} from '@angular/common';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  activeTab: number;
  current: string;
  lastTab: number;
  canManageCVs: boolean = false;
  canRunJobs: boolean = false;
  canImportData: boolean =false;
  canManageUsers: boolean = false;
  canViewServerFiles:boolean = false;
  canViewServiceInfo:boolean = false;
  private subscriptions: Subscription[] = [];
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    console.log(`in admin.component ngOnInit`);
    await this.checkPrivileges();
  
    const routeSub =this.activatedRoute.params.subscribe(routeParams => {
      this.current = routeParams.function;
      let actualTab = this.getActualTab(this.current);
      switch (this.current) {
        case 'cache': this.activeTab = 0; break;
        case 'info': 
           this.activeTab = actualTab;
           break;
        case 'user':
          if(!this.canManageUsers){
            console.log("user does not have privs to manage users");
            this.activeTab=-1;
            break;
          }
           this.activeTab = actualTab; break;
        case 'import': 
          if( !this.canImportData ) {
            console.log("user does not have privs to import data");
            this.activeTab=-1;
            break;
          }
          this.activeTab = actualTab;
          break;
         
        case 'cv': 
          if( !this.canManageCVs ) {
            console.log("user does not have privs to manage CVs");
            this.activeTab=-1;
            break;
          }
          this.activeTab = actualTab; 
          break;
        
        case 'jobs':
          if(!this.canRunJobs){
            console.log("user does not have privs to run jobs");
            this.activeTab=-1;
            break;
          }
           this.activeTab = actualTab;
           break;
        case 'files':
          if( !this.canViewServerFiles){
            console.log("user does not have privs to view server files");
            this.activeTab=-1;
            break;
          }
          this.activeTab = actualTab;
          break;
        case 'data':
          if( !this.canImportData){
            console.log("user does not have privs to import data");
            this.activeTab=-1;
            break;
          }
          this.activeTab = actualTab;
          break;

        default: this.activeTab = 0; break;
      }
    
      if( this.activeTab <= -1) {
        this.router.navigate(['/home' ] );
      }
    });
    this.subscriptions.push(routeSub);
    const tab = this.activatedRoute.snapshot.queryParams['function'] || 'cache';
  console.log('ngoninit complete at ' + (new Date()));
}

async checkPrivileges() {
  this.canManageCVs = await this.authService.hasSpecificPrivilege("Manage CVs");
  this.canRunJobs = await this.authService.hasSpecificPrivilege("Run Tasks");
  this.canImportData = await this.authService.hasSpecificPrivilege("Import Data");
  this.canManageUsers = await this.authService.hasSpecificPrivilege("Manage Users");
  this.canViewServerFiles = await this.authService.hasSpecificPrivilege("View Files");
  this.canViewServiceInfo = await this.authService.hasSpecificPrivilege("View Service Info");
  console.log(`canManageCVs: ${this.canManageCVs}; canRunJobs: ${this.canRunJobs};  canImportData: ${this.canImportData}; canManageUsers: ${this.canManageUsers}; canViewServerFiles: ${this.canViewServerFiles}`);
  console.log('checkPrivileges complete');
}

  onTabChanged(event: MatTabChangeEvent): void {

    console.log(`starting onTabChanged event.index: ${event.index} at ` + (new Date()));
    let route = 'cache';

    let newRoute = this.getActualTabName(event.index);
    if( newRoute.length > 0) {
      route = newRoute;
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

  getFilteredTabs() {
      let allTabs = [
      {name: 'cache', available: this.canViewServiceInfo},
      {name: 'info', available: this.canViewServiceInfo},
      {name: 'user', available: this.canManageUsers},
      {name: 'import', available: this.canImportData},
      {name: 'cv', available: this.canManageCVs},
      {name: 'jobs', available: this.canRunJobs},
      {name: 'files', available: this.canViewServerFiles},
      {name: 'data', available: this.canImportData}
    ]

    return allTabs.filter(t=>t.available);
  }

  getActualTab(desiredFunctionality:string): number {
    console.log(`getActualTab looking for ${desiredFunctionality}`);

    let filteredTabs = this.getFilteredTabs();
    for(var t=0; t< filteredTabs.length; t++) {
      if(filteredTabs[t].name == desiredFunctionality){
        return t;
      }
    }
    console.log(`getActualTab did not locate desire tab`);
    return -1;
  }

  getActualTabName(tabNumber: number) {
    let filteredTabs = this.getFilteredTabs();
    if( tabNumber <0 || tabNumber >= filteredTabs.length) return '';
    return filteredTabs[tabNumber].name;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }
}
