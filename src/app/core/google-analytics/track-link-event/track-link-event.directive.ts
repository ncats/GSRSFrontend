import { Directive, HostListener, Input } from '@angular/core';
import { Environment } from '../../../../environments/environment.model';
import { GoogleAnalyticsService } from '../google-analytics.service';
import { ConfigService } from '../../config/config.service';

@Directive({
  selector: '[appTrackLinkEvent]'
})
export class TrackLinkEventDirective {
  @Input() evCategory = 'Undefined';
  @Input() evAction = 'click-link';
  @Input() evLabel: string;
  @Input() evValue: number;
  environment: Environment;

  constructor(
    private gaService: GoogleAnalyticsService,
    private configService: ConfigService
  ) {
    this.environment = this.configService.environment;
  }

  @HostListener('click', ['$event.target'])
  onClick(element) {

    if (this.environment.isAnalyticsPrivate) {
      this.evLabel = 'link';
    } else if (!this.evLabel && element.href) {
      this.evLabel = element.href;
    }

    this.gaService.sendEvent(this.evCategory, this.evAction, this.evLabel, this.evValue);
  }
}
