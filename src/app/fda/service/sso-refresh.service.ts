import { Injectable, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '@gsrs-core/auth';
import { UtilsService } from '@gsrs-core/utils';
import { ConfigService } from '@gsrs-core/config/config.service';

@Injectable()
export class SsoRefreshService implements OnDestroy {
  private iframe: HTMLIFrameElement;
  private refreshInterval: any;
  private baseHref: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private utilsService: UtilsService,
    private configService: ConfigService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.iframe = document.createElement('IFRAME') as HTMLIFrameElement;
      this.iframe.title = 'page refresher';
      this.iframe.name = 'refresher';
      this.iframe.style.height = '0';
      this.iframe.style.opacity = '0';
      this.iframe.src = `/assets/refresh/refresh.html`;
      document.body.appendChild(this.iframe);

      if (window.location.pathname.indexOf('/ginas/app/beta/') > -1) {
        this.baseHref = '/ginas/app/beta/';
      }
    }
}

init(): any {
  this.authService.getAuth().subscribe(auth => {
    if (auth != null && this.refreshInterval == null) {
      const homeBaseUrl = this.configService.configData && this.configService.configData.gsrsHomeBaseUrl || null;
      if (homeBaseUrl) {
        this.baseHref = homeBaseUrl;
      }
      clearInterval(this.refreshInterval);
      this.refreshInterval = setInterval(() => {
        this.iframe.src = `${this.baseHref || ''}assets/refresh/refresh.html?key=${this.utilsService.newUUID()}`;
      }, 120000);
    } else {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  });
}

ngOnDestroy() {
  clearInterval(this.refreshInterval);
  this.refreshInterval = null;
}
}
