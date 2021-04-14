import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { ConfigService } from '@gsrs-core/config';
import { Environment } from 'src/environments/environment.model';
import { AuthService } from '@gsrs-core/auth';
import { Router, NavigationExtras } from '@angular/router';
import { SubstanceService } from '@gsrs-core/substance';
import { take } from 'rxjs/operators';
@Component({
  selector: 'app-registrars',
  templateUrl: './registrars.component.html',
  styleUrls: ['./registrars.component.scss']
})
export class RegistrarsComponent implements OnInit {

  environment: Environment;
  baseDomain: string;
  isAuthenticated = false;
  contactEmail: string;
  isClosedWelcomeMessage = true;
  imageLoc: any;
  appId: string;
  customLinks: Array<any>;

  browseAll: string;
  application: string;
  chemicon: string;
  clasicBaseHref: string;

  // Config for Adverse Event on Shiny Server
  adverseEventShinyHomepageDisplay = false;
  adverseEventShinyHomepageURL: string;

  constructor(
    private gaService: GoogleAnalyticsService,
    private configService: ConfigService,
    private authService: AuthService,
    private substanceService: SubstanceService,
    private router: Router
  ) {
    this.contactEmail = this.configService.configData.contactEmail;
    this.clasicBaseHref = this.configService.environment.clasicBaseHref;
  }

  ngOnInit() {
    this.environment = this.configService.environment;
    this.application = `${this.configService.environment.baseHref || '/'}assets/icons/home/icon_application.png`;
    this.browseAll = `${this.configService.environment.baseHref || '/'}assets/icons/home/icon_browseall.png`;
    this.chemicon = `${this.configService.environment.baseHref || '/'}assets/icons/home/icon_registersubstance.png`;
    this.appId = this.configService.environment.appId;

    this.authService.hasAnyRolesAsync('DataEntry', 'SuperDataEntry', 'Admin').subscribe(response => {
      this.isAuthenticated = response;
    });
    this.gaService.sendPageView(`Home`);
    this.baseDomain = this.configService.configData.apiUrlDomain;
    this.customLinks = this.configService.configData.registrarDynamicLinks;
    this.customLinks.forEach (link => {
      console.log(link);
      const searchStr = `${link.facetName}:${link.facetValue}`;
      this.substanceService.searchSingleFacet(link.facetName, link.facetValue).pipe(take(1)).subscribe( response => {
        console.log(response);
        link.total = response.total;
        console.log(link.total);
      });
    });
    this.isClosedWelcomeMessage = localStorage.getItem('isClosedWelcomeMessage') === 'true';

  }

  routeToCustom(link) {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'facets': link.facetName + '*' + link.facetValue + '.true' }
    };
    this.router.navigate(['/browse-substance'], navigationExtras);
  }

  processFacets() {
    this.customLinks.forEach(link => {
      let string = '';
      for (let i = 0; i < link.facets.length; i++) {

        if (i === 0) {
            string = 'facets:' + link.facetName + '*' + link.facetValue + '.true';
        } else {
          string += ',' + link.facetName + '*' + link.facetValue + '.true';
        }
      }
    });
  }

}
