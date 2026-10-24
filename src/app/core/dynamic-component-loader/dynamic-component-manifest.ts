import { InjectionToken, Type } from '@angular/core';

export const DYNAMIC_COMPONENT_MANIFESTS = new InjectionToken<any>('DYNAMIC_COMPONENT_MANIFESTS');

export interface LazyLoadedComponentDefinition {
  componentId: string;
  loadComponent: () => Promise<Type<any>>;
}

export interface DynamicComponentManifest<T> {
  component: Type<T>;
  componentType: string;
}
