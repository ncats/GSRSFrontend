import {
    ANALYZE_FOR_ENTRY_COMPONENTS,
    ModuleWithProviders,
    NgModule,
    NgModuleFactoryLoader,
    SystemJsNgModuleLoader,
    Type,
} from '@angular/core';
import { ROUTES } from '@angular/router';

import { DynamicComponentLoader } from './dynamic-component-loader.service';
import {
  DYNAMIC_COMPONENT,
  LAZY_LOADED_COMPONENT_MANIFESTS,
  DYNAMIC_MODULE,
  DYNAMIC_COMPONENT_MANIFESTS,
  LazyLoadedComponentManifest,
  DynamicComponentManifest
} from './dynamic-component-manifest';

@NgModule()
export class DynamicComponentLoaderModule {
  static forRoot(
      lazyLoadedManifests: LazyLoadedComponentManifest[] = [],
      dynamicManifests: DynamicComponentManifest<any>[] = []
    ): ModuleWithProviders {
    return {
      ngModule: DynamicComponentLoaderModule,
      providers: [
        DynamicComponentLoader,
        { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
        // provider for Angular CLI to analyze
        { provide: ROUTES, useValue: lazyLoadedManifests, multi: true },
        // provider for DynamicComponentLoader to analyze
        { provide: LAZY_LOADED_COMPONENT_MANIFESTS, useValue: lazyLoadedManifests, multi: true },
        { provide: DYNAMIC_COMPONENT_MANIFESTS, useValue: dynamicManifests, multi: true }
      ],
    };
  }
  static forModule(manifest: LazyLoadedComponentManifest): ModuleWithProviders {
    return {
      ngModule: DynamicComponentLoaderModule,
      providers: [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: manifest, multi: true },
        // provider for @angular/router to parse
        { provide: ROUTES, useValue: manifest, multi: true },
        // provider for DynamicComponentLoader to analyze
        { provide: DYNAMIC_MODULE, useValue: manifest }
      ],
    };
  }
  static forChild(component: Type<any>): ModuleWithProviders {
    return {
      ngModule: DynamicComponentLoaderModule,
      providers: [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: component, multi: true },
        // provider for @angular/router to parse
        { provide: ROUTES, useValue: [], multi: true },
        // provider for DynamicComponentLoader to analyze
        { provide: DYNAMIC_COMPONENT, useValue: component },
      ],
    };
  }
}
