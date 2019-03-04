import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {
  mainPathSegment = '';
  navItems = [
    {
      display: 'Browse Substances',
      path: 'browse-substance'
    },
    {
      display: 'Structure Search',
      path: 'structure-search'
    },
    {
      display: 'Sequence Search',
      path: 'sequence-search'
    }
  ];

  constructor(
    private router: Router
  ) { }

  ngOnInit() {

    if (environment.navItems && environment.navItems.length) {
      this.navItems.concat(environment.navItems);
    }

    this.router.events.subscribe((event: RouterEvent) => {

      if (event instanceof NavigationEnd) {
        this.mainPathSegment = this.getMainPathSegmentFromUrl(event.url.substring(1));
      }
    });

    this.mainPathSegment = this.getMainPathSegmentFromUrl(this.router.routerState.snapshot.url.substring(1));
  }

  getMainPathSegmentFromUrl(url: string): string {
    const path = url.split('?')[0];
    const mainPathPart = path.split('/')[0];
    return mainPathPart;
  }

}
