import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {Location} from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  activeTab: number;
  current: string;
  lastTab: number;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(routeParams => {
      this.current = routeParams.function;
      switch (this.current) {
        case 'cache': this.activeTab = 0; break;
        case 'user': this.activeTab = 1; break;
        case 'data': this.activeTab = 2; break;
        case 'cv': this.activeTab = 3; break;
        case 'jobs': this.activeTab = 4; break;
        case 'files': this.activeTab = 5; break;
        case 'import': this.activeTab = 6; break;

        default: this.activeTab = 0; break;
    }
    });
    const tab = this.activatedRoute.snapshot.queryParams['function'] || 'cache';

}


  onTabChanged(event: MatTabChangeEvent): void {

    let route = 'cache';

    switch (event.index) {
      case 0:

        break;
      case 1:
      route = 'user';
        break;
      case 2:
        route = 'data';
      break;
      case 3:
        route = 'cv';
      break;
      case 4:
        route = 'jobs';
      break;
      case 5:
        route = 'files';
      break;
      case 5:
        route = 'import';
      break;
    }
    if (this.current !== 'jobs') {
      this.current = route;
      this.router.navigate(['/admin/' + route] );
    } else {
      this.current = route;
      this.activeTab = 0;
      this.router.navigate(['/admin/' + route] );
    }


  }
}
