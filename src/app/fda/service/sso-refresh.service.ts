import { Injectable, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { take } from 'rxjs/operators';
import { AuthService } from '@gsrs-core/auth';
import { UtilsService } from '@gsrs-core/utils';
import { ConfigService } from '@gsrs-core/config/config.service';

@Injectable()
export class SsoRefreshService implements OnDestroy {
  private iframe: HTMLIFrameElement;
  private refreshInterval: any;
  private baseHref: string;
  private showHeaderBar = 'true';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private utilsService: UtilsService,
    private configService: ConfigService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    if (isPlatformBrowser(this.platformId)) {

      if (window.location.pathname.indexOf('/ginas/app/ui/') > -1) {
        this.baseHref = '/ginas/app/';
      }
    }
  }

  updateIframe(): any {
    if (!this.iframe) {
      this.iframe = document.createElement('IFRAME') as HTMLIFrameElement;
      this.iframe.title = 'page refresher';
      this.iframe.name = 'refresher';
      this.iframe.style.height = '0';
      this.iframe.style.opacity = '0';
      this.iframe.src = `${this.baseHref || ''}api/v1/whoami?key=${this.utilsService.newUUID()}&noWarningBox=true`;
      document.body.appendChild(this.iframe);
    } else {
      this.iframe.src = `${this.baseHref || ''}api/v1/whoami?key=${this.utilsService.newUUID()}&noWarningBox=true`;
    }
  }

  setup() {
    this.configService.afterLoad().then(cd => {
      const homeBaseUrl = this.configService.configData && this.configService.configData.gsrsHomeBaseUrl || null;
      if (homeBaseUrl) {
        this.baseHref = homeBaseUrl;
        this.updateIframe();
      }
      clearInterval(this.refreshInterval);
      this.refreshInterval = setInterval(() => {
        console.log("REFRESHING iFrame");
        this.updateIframe();
      }, 600000);
    });
  }

  init(): any {
    if(new URLSearchParams(window.location.search).get("noWarningBox") === 'true'){
      //do not do sso refresher recursively
      return;
    }
    if (new URLSearchParams(window.location.search).get("header") === 'false') {
      this.setup();
    } else {
      this.authService.getAuth().subscribe(auth => {
        if (auth != null && this.refreshInterval == null) {
          this.setup();
        } else if (auth === null){
          clearInterval(this.refreshInterval);
          this.refreshInterval = null;
        }
      });
    } //else
  }

  ngOnDestroy() {
    clearInterval(this.refreshInterval);
    this.refreshInterval = null;
  }
}
