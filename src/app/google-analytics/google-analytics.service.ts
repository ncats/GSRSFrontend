import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ConfigService } from '../config/config.service';
import { Router } from '@angular/router';
import { SendFields } from './google-analytics.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalyticsService {
  private googleAnanlyticsId: string;
  private analyticsObjectKey: string;
  private analytics: any;
  private isActive = false;

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

    this.isActive = true;

    this.analytics('create', this.googleAnanlyticsId, { cookieName: 'gsrsCookie' });
    this.analytics('set', 'screenResolution', `${window.screen.availWidth}x${window.screen.availHeight}`);
    this.analytics('set', 'viewportSize', `${window.innerHeight}x${window.innerWidth}`);

    if (environment.isAnalyticsPrivate) {
      this.analytics('set', 'allowAdFeatures', false);
      this.analytics('set', 'anonymizeIp', true);
      this.analytics('set', 'referrer', 'https://none.com');
      this.analytics('set', 'location', 'https://none.com');
    }

    this.isActive = true;

    if (this.configService.configData.appId) {
      this.analytics('set', 'appId', this.configService.configData.appId);
    }

    if (this.configService.configData.version) {
      this.analytics('set', 'appVersion', this.configService.configData.version);
    }

    const node = document.createElement('script');
    node.src = 'https://www.google-analytics.com/analytics.js';
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  sendPageView(title?: string, sessionControl?: 'start' | 'end', path?: string): void {

    if (this.isActive) {
      if (path == null && title != null) {
        path = `/${title.replace(/ /g, '-').toLowerCase()}`;
      }

      const sendFields: SendFields = {
        hitType: 'pageview',
        title: title,
        page: path,
        sessionControl: sessionControl
      };
      this.analytics('send', sendFields);
    }
  }

  sendEvent(eventCategory?: string, eventAction?: string, eventLabel?: string, eventValue?: number): void {

    if (this.isActive) {
      const sendFields: SendFields = {
        hitType: 'event',
        eventCategory: eventCategory,
        eventAction: eventAction,
        eventLabel: eventLabel,
        eventValue: eventValue
      };

      this.analytics('send', sendFields);
    }
  }

  sendException(exDescription: string, exFatal?: boolean): void {
    if (this.isActive) {
      const sendFields: SendFields = {
        hitType: 'exception',
        exDescription: exDescription,
        exFatal: exFatal
      };

      this.analytics('send', sendFields);
    }
  }

  setTitle(title: string): void {
    if (this.isActive) {
      this.analytics('set', 'title', title);
    }
  }
}
