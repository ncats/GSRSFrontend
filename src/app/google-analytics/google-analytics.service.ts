import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  private googleAnanlyticsId: string;

  constructor(
    public configService: ConfigService
  ) {
    if (configService.configData.googleAnalyticsId) {
      this.googleAnanlyticsId = configService.configData.googleAnalyticsId;
      this.init();
    }
  }

  init() {

  }
}
