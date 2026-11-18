import { Routes } from '@angular/router';
import { Provider, EnvironmentProviders } from '@angular/core';
import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.appId = 'gsrs';
environment.clasicBaseHref = '/ginas/app/';
environment.apiBaseUrl = 'http://localhost:9000/ginas/app/';

export const EXTRA_ROUTES: Routes = [];

export const ENVIRONMENT_PROVIDERS: Array<Provider | EnvironmentProviders> = [];
