import {
  ApplicationConfig,
  ErrorHandler,
  inject,
  importProvidersFrom,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withRouterConfig, withPreloading, PreloadAllModules } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, withJsonpSupport, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { WidgetRegistry, SchemaFormModule } from 'ngx-schema-form';

import { routes } from './app.routes';
import { configServiceFactory } from './config/config.factory';
import { ConfigService } from './config/config.service';
import { LAZY_LOADED_COMPONENT_DEFINITIONS } from './dynamic-component-loader/dynamic-component-loader.service';
import { DYNAMIC_COMPONENT_MANIFESTS } from './dynamic-component-loader/dynamic-component-manifest';
import { dynamicComponentDefinitions } from './app-dynamic-component-manifests';
import { SubstanceCardsModule } from './substance-details/substance-cards.module';
import { substanceCardsFilters } from './substance-details/substance-cards-filters.constant';
import { AuthInterceptor } from './auth/auth.interceptor';
import { CsrfTokenInterceptor } from '@gsrs-core/auth/csrf-token.interceptor';
import { GlobalErrorHandler } from '@gsrs-core/error-handler/error-handler';
import { MyWidgetRegistry } from '@gsrs-core/substances-browse/export-dialog/custom-checkbox-widget/custom-checkbox-registry';
import { ENVIRONMENT_PROVIDERS } from '../../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(
      routes,
      withRouterConfig({ onSameUrlNavigation: 'reload' }),
      withPreloading(PreloadAllModules)
    ),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi(), withJsonpSupport()),
    // was previously supplied at root by MatNativeDateModule (in AppModule.imports); components
    // using MatDatepickerModule don't provide their own DateAdapter, so this must stay at root
    provideNativeDateAdapter(),

    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    ConfigService,
    provideAppInitializer(() => configServiceFactory(inject(ConfigService))()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CsrfTokenInterceptor, multi: true },

    // SubstanceCardsModule.forRoot(): SubstanceCardsService + base SUBSTANCE_CARDS_FILTERS entry
    importProvidersFrom(SubstanceCardsModule.forRoot(substanceCardsFilters)),

    // SchemaFormModule.forRoot(): WidgetRegistry(default), SchemaValidatorFactory,
    // ExpressionCompilerFactory, LOG_LEVEL, LogService
    importProvidersFrom(SchemaFormModule.forRoot()),
    // Explicit override — must stay after the importProvidersFrom() line above.
    { provide: WidgetRegistry, useClass: MyWidgetRegistry },

    // consumed by DynamicComponentLoader.getDynamicComponent()
    { provide: LAZY_LOADED_COMPONENT_DEFINITIONS, useValue: dynamicComponentDefinitions, multi: true },
    // root-level fallback so DYNAMIC_COMPONENT_MANIFESTS always has a provider, even in builds
    // (gsrs.*) where ENVIRONMENT_PROVIDERS doesn't contribute any entries of its own; fda
    // builds add their real entries to this same multi-provider token on top of this empty base
    { provide: DYNAMIC_COMPONENT_MANIFESTS, useValue: [], multi: true },

    // per-build-variant additions (fileReplacements swap), mirrors the EXTRA_ROUTES pattern
    ...ENVIRONMENT_PROVIDERS,
  ],
};
