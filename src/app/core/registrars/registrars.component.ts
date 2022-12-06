import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { ConfigService, LoadedComponents } from '@gsrs-core/config';
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
  customLinks1: Array<any>;
  customLinks2: Array<any>;

  browseAll: string;
  application: string;
  chemicon: string;
  clasicBaseHref: string;
  loadedComponents: LoadedComponents;

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
    this.application = `${this.configService.environment.baseHref || ''}assets/icons/home/icon_application.png`;
    this.browseAll = `${this.configService.environment.baseHref || ''}assets/icons/home/icon_browseall.png`;
    this.chemicon = `${this.configService.environment.baseHref || ''}assets/icons/home/icon_registersubstance.png`;
    this.loadedComponents = this.configService.configData.loadedComponents || null;
    this.appId = this.configService.environment.appId;

    this.authService.hasAnyRolesAsync('DataEntry', 'SuperDataEntry', 'Admin').subscribe(response => {
      this.isAuthenticated = response;
    });
    this.gaService.sendPageView(`Home`);
    this.baseDomain = this.configService.configData.apiUrlDomain;
    this.customLinks1 = this.configService.configData.registrarDynamicLinks;
    this.customLinks2 = this.configService.configData.registrarDynamicLinks2;

    this.customLinks1.forEach (link => {
      let str = '';
      for (let i = 0; i < link.facets.length; i++) {

        if (i === 0) {
            str = 'facet=' + link.facets[i].facetName + '/' + link.facets[i].facetValue;
        } else {
          str += '&facet=' + link.facets[i].facetName + '/' + link.facets[i].facetValue;
        }
      }
      this.substanceService.searchFromString(str).pipe(take(1)).subscribe( response => {
        link.total = response.total;
      });
    });
    this.customLinks2.forEach (link => {
      let str = '';
      for (let i = 0; i < link.facets.length; i++) {

        if (i === 0) {
            str = 'facet=' + link.facets[i].facetName + '/' + link.facets[i].facetValue;
        } else {
          str += '&facet=' + link.facets[i].facetName + '/' + link.facets[i].facetValue;
        }
      }
      this.substanceService.searchFromString(str).pipe(take(1)).subscribe( response => {
        link.total =  Number(response.total);
      });
    });
    this.isClosedWelcomeMessage = localStorage.getItem('isClosedWelcomeMessage') === 'true';
    this.processFacets();
  }

  routeToCustom(link) {
    for (let i = 0; i < link.facets.length; i++) {
      let string = '';
      if (i === 0) {
          string = 'facets:' + link.facetName + '*' + link.facetValue + '.true';
      } else {
        string += ',' + link.facetName + '*' + link.facetValue + '.true';
      }
    }
    const navigationExtras: NavigationExtras = {
      queryParams: { 'facets': link.facetName + '*' + link.facetValue + '.true' }
    };
    this.router.navigate(['/browse-substance'], navigationExtras);
  }

  processFacets() {
    this.customLinks1.forEach(link => {
      let str = '';
      for (let i = 0; i < link.facets.length; i++) {

        if (i === 0) {
            str += '' + link.facets[i].facetName + '*' + link.facets[i].facetValue + '.true';
        } else {
          str += ',' + link.facets[i].facetName + '*' + link.facets[i].facetValue + '.true';
        }
      }

      link.queryParams = str;
    });

    this.customLinks2.forEach(link => {
      let str = '';
      for (let i = 0; i < link.facets.length; i++) {

        if (i === 0) {
            str += '' + link.facets[i].facetName + '*' + link.facets[i].facetValue + '.true';
        } else {
          str += ',' + link.facets[i].facetName + '*' + link.facets[i].facetValue + '.true';
        }
      }

      link.queryParams = str;
    });
  }

}
