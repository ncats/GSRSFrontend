import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  roundLogoSrcPath: string;

  constructor(
    private gaService: GoogleAnalyticsService
  ) { }

  ngOnInit() {
    this.gaService.sendPageView(`Home`);
    this.roundLogoSrcPath = `${environment.baseHref || '/'}assets/images/gsrs-logo-round.svg`;
  }
}
