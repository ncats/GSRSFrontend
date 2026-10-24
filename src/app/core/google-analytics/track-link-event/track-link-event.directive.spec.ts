import { TrackLinkEventDirective } from './track-link-event.directive';
import { GoogleAnalyticsService } from '../google-analytics.service';
import { ConfigService } from '@gsrs-core/config';

describe('TrackLinkEventDirective', () => {
  it('should create an instance', () => {
    const directive = new TrackLinkEventDirective({} as GoogleAnalyticsService, {} as ConfigService);
    expect(directive).toBeTruthy();
  });
});
