import { Routes } from '@angular/router';
import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.apiBaseUrl = '/ginas/app/';
environment.production = true;
environment.baseHref = '/ginas/app/ui/';
environment.clasicBaseHref = '/ginas/app/';
environment.appId = 'gsrs';
environment.googleAnalyticsId = null;
environment.isAnalyticsPrivate = true;

export { GsrsModule as EnvironmentModule } from '../app/core/gsrs.module';

export const EXTRA_ROUTES: Routes = [];
