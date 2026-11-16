import { Routes } from '@angular/router';
import { Provider, EnvironmentProviders } from '@angular/core';
import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.appId = 'gsrs';
environment.apiBaseUrl = 'http://fdadev.ncats.io:9000/ginas/app/';
environment.clasicBaseHref = '/ginas/app/';
environment.googleAnalyticsId = 'UA-136176848-1';

export const EXTRA_ROUTES: Routes = [];

export const ENVIRONMENT_PROVIDERS: Array<Provider | EnvironmentProviders> = [];
