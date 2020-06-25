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
    this.application = `${this.environment.baseHref || '/'}assets/icons/home/icon_application.png`;
    this.browseAll = `${this.environment.baseHref || '/'}assets/icons/home/icon_browseall.png`;
    this.chemicon = `${this.environment.baseHref || '/'}assets/icons/home/icon_registersubstance.png`;
    this.appId = this.environment.appId;

    this.authService.hasAnyRolesAsync('DataEntry', 'SuperDataEntry', 'Admin').subscribe(response => {
      this.isAuthenticated = response;
    });
    this.gaService.sendPageView(`Home`);
    this.baseDomain = this.configService.configData.apiUrlDomain;
    this.isClosedWelcomeMessage = localStorage.getItem('isClosedWelcomeMessage') === 'true';
  }

  closeWelcomeMessage(): void {
    this.isClosedWelcomeMessage = true;
    localStorage.setItem('isClosedWelcomeMessage', this.isClosedWelcomeMessage.toString());
  }

  browseSubstances(): void {
    this.router.navigate(['/browse-substance']);
  }
}
