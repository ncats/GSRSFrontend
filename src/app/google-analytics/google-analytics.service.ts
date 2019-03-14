import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ConfigService } from '../config/config.service';
import { Router, RouterEvent, NavigationEnd, NavigationStart } from '@angular/router';
import { HitType, SendFields } from './google-analytics.model';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  private googleAnanlyticsId: string;
  private analyticsObjectKey: string;
  private analytics: any;

  constructor(
    public configService: ConfigService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)
      && configService.configData
      && configService.configData.googleAnalyticsId) {
      this.googleAnanlyticsId = configService.configData.googleAnalyticsId;
      this.init();
    }
  }

  init() {
    this.analyticsObjectKey = Math.random().toString(36).replace('0.', '');
    window['GoogleAnalyticsObject'] = this.analyticsObjectKey;

    this.analytics = window[this.analyticsObjectKey] = window[this.analyticsObjectKey] || function() {
      (window[this.analyticsObjectKey].q = window[this.analyticsObjectKey].q || []).push(arguments);
      this.analytics = window[this.analyticsObjectKey];
    };

    this.analytics.l = +new Date;

    this.analytics('create', this.googleAnanlyticsId, { cookieName: 'gsrsCookie' });
    this.analytics('set', 'allowAdFeatures', false);
    this.analytics('set', 'screenResolution', `${window.screen.availWidth}x${window.screen.availHeight}`);
    this.analytics('set', 'viewportSize', `${window.innerHeight}x${window.innerWidth}`);

    if (this.configService.configData.appId) {
      this.analytics('set', 'appId', this.configService.configData.appId);
    }

    if (this.configService.configData.version) {
      this.analytics('set', 'appVersion', this.configService.configData.version);
    }

    this.router.events.subscribe((event: RouterEvent) => {
      if (this.router.routerState.snapshot.url) {
        if (event instanceof NavigationEnd) {
          this.sendPageView(this.router.routerState.snapshot.url, 'start');
        } else if (event instanceof NavigationStart) {
          this.sendPageView(this.router.routerState.snapshot.url, 'end');
        }
      }
    });

    const node = document.createElement('script');
    node.src = 'https://www.google-analytics.com/analytics.js';
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  sendPageView(path: string, sessionControl?: 'start' | 'end'): void {

    const sendFields: SendFields = {
      hitType: 'pageview',
      page: path,
      sessionControl: sessionControl
    };

    this.analytics('send', sendFields);
  }

  sendEvent(eventCategory?: string, eventAction?: string, eventLabel?: string, eventValue?: number): void {
    const sendFields: SendFields = {
      hitType: 'event',
      eventCategory: eventCategory,
      eventAction: eventAction,
      eventLabel: eventLabel,
      eventValue: eventValue
    };

    this.analytics('send', sendFields);
  }

  sendException(exDescription: string, exFatal?: boolean): void {
    const sendFields: SendFields = {
      hitType: 'exception',
      exDescription: exDescription,
      exFatal: exFatal
    };

    this.analytics('send', sendFields);
  }

  setTitle(title: string): void {
    this.analytics('set', 'title', title);
  }
}
