import { Routes } from '@angular/router';
import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
environment.appId = 'gsrs';
environment.clasicBaseHref = '/ginas/app/';
environment.apiBaseUrl = 'http://localhost:9000/ginas/app/';

export { GsrsModule as EnvironmentModule } from '../app/core/gsrs.module';

export const EXTRA_ROUTES: Routes = [];
