import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { ConfigService } from '@gsrs-core/config';
import { Environment } from 'src/environments/environment.model';
import { AuthService } from '@gsrs-core/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  environment: Environment;
  baseDomain: string;
  isAuthenticated = false;
  contactEmail: string;
  isClosedWelcomeMessage = true;
  imageLoc: any;
  appId: string;

  browseAll: string;
  application: string;
  chemicon: string;
  clasicBaseHref: string;

  //Config for Adverse Event on Shiny Server
  adverseEventShinyHomepageDisplay: string;
  adverseEventShinyHomepageURL: string;

  constructor(
    private gaService: GoogleAnalyticsService,
    private configService: ConfigService,
    private authService: AuthService,
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
    this.isClosedWelcomeMessage = localStorage.getItem('isClosedWelcomeMessage') === 'true';

    this.getAdverseEventShinyConfig();
  }

  closeWelcomeMessage(): void {
    this.isClosedWelcomeMessage = true;
    localStorage.setItem('isClosedWelcomeMessage', this.isClosedWelcomeMessage.toString());
  }

  browseSubstances(): void {
    this.router.navigate(['/browse-substance']);
  }

  getAdverseEventShinyConfig(): void {
    if (this.configService.configData) {
      if (this.configService.configData.adverseEventShinyHomepageDisplay !== null) {
        this.adverseEventShinyHomepageDisplay = JSON.parse(this.configService.configData.adverseEventShinyHomepageDisplay);
      }
      if (this.configService.configData.adverseEventShinyHomepageURL !== null) {
        this.adverseEventShinyHomepageURL = this.configService.configData.adverseEventShinyHomepageURL;
      }
    }
  }

}
