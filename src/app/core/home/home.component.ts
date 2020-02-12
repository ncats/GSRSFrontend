import { Component, OnInit } from '@angular/core';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { ConfigService } from '@gsrs-core/config';
import { Environment } from '@environment';
import { AuthService } from '@gsrs-core/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  environment: Environment;
  baseDomain: string;
  isAuthenticated = false;

  constructor(
    private gaService: GoogleAnalyticsService,
    private configService: ConfigService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth => {
      this.isAuthenticated = auth != null;
    });
    this.gaService.sendPageView(`Home`);
    this.environment = this.configService.environment;
    this.baseDomain = this.configService.configData.apiUrlDomain;
  }
}
