import { Routes } from '@angular/router';
import { Provider, EnvironmentProviders } from '@angular/core';
import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.apiBaseUrl = '/ginas/app/';
environment.production = true;
environment.baseHref = '/ginas/app/ui/';
environment.clasicBaseHref = '/ginas/app/';
environment.appId = 'gsrs';
environment.googleAnalyticsId = null;
environment.isAnalyticsPrivate = true;

export const EXTRA_ROUTES: Routes = [];

export const ENVIRONMENT_PROVIDERS: Array<Provider | EnvironmentProviders> = [];
