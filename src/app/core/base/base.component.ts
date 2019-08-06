import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Environment } from '../../../environments/environment.model';
import { AuthService } from '../auth/auth.service';
import { Auth } from '../auth/auth.model';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
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
    },
    {
      display: 'Register',
      children: [
        {
          display: 'Chemical',
          path: 'substances/register'
        }
      ]
    }
  ];
  logoSrcPath: string;
  auth?: Auth;
  environment: Environment;
  searchValue: string;

  constructor(
    private router: Router,
    public authService: AuthService,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    if (this.activatedRoute.snapshot.queryParamMap.has('search')) {
      this.searchValue = this.activatedRoute.snapshot.queryParamMap.get('search');
    }

    this.activatedRoute.queryParamMap.subscribe(params => {
      this.searchValue = params.get('search');
    });

    this.authService.getAuth().subscribe(auth => {
      this.auth = auth;
    });

    this.environment = this.configService.environment;

    if (this.environment.navItems && this.environment.navItems.length) {
      this.navItems.concat(this.environment.navItems);
    }

    this.logoSrcPath = `${this.environment.baseHref || '/'}assets/images/gsrs-logo.svg`;

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

  routeToLogin(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        path: this.router.url
      }
    };

    this.router.navigate(['/login'], navigationExtras);
  }

  processSubstanceSearch(searchValue: string) {
    this.navigateToSearchResults(searchValue);
  }

  navigateToSearchResults(searchTerm: string) {

    const navigationExtras: NavigationExtras = {
      queryParams: searchTerm ? { 'search': searchTerm } : null
    };

    this.router.navigate(['/browse-substance'], navigationExtras);
  }
}
