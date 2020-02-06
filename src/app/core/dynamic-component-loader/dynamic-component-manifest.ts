import { InjectionToken, Type } from '@angular/core';

export const DYNAMIC_COMPONENT = new InjectionToken<any>('DYNAMIC_COMPONENT');

export const DYNAMIC_MODULE = new InjectionToken<any>('DYNAMIC_MODULE');

export const LAZY_LOADED_COMPONENT_MANIFESTS = new InjectionToken<any>('LAZY_LOADED_COMPONENT_MANIFESTS');

export const DYNAMIC_COMPONENT_MANIFESTS = new InjectionToken<any>('DYNAMIC_COMPONENT_MANIFESTS');

export interface LazyLoadedComponentManifest {

  /** Unique identifier, used in the application to retrieve a ComponentFactory. */
  componentId: string;

  /** Unique identifier, used internally by Angular. */
  path: string;

  /** Path to component module. */
  loadChildren: string | any; // Support for angular 8 style module imports
}

export interface DynamicComponentManifest<T> {
  component: Type<T>;
}
