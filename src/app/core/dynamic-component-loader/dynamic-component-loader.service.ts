import {
  Inject,
  Injectable,
  InjectionToken,
  Optional,
  Type,
} from '@angular/core';
import { from, Observable, throwError } from 'rxjs';

import { LazyLoadedComponentDefinition } from './dynamic-component-manifest';

export const LAZY_LOADED_COMPONENT_DEFINITIONS = new InjectionToken<LazyLoadedComponentDefinition[][]>('LAZY_LOADED_COMPONENT_DEFINITIONS');

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentLoader {

  constructor(
    @Optional() @Inject(LAZY_LOADED_COMPONENT_DEFINITIONS) private definitionLists: LazyLoadedComponentDefinition[][],
  ) {
  }

  /**
   * Retrieve a standalone component class directly, based on the specified
   * componentId (defined in a LazyLoadedComponentDefinition array).
   */
  getDynamicComponent<T>(componentId: string): Observable<Type<T>> {
    const definition = (this.definitionLists ?? [])
      .reduce((acc, val) => acc.concat(val), [])
      .find(d => d.componentId === componentId);
    if (!definition) {
      return throwError(() => new Error(`DynamicComponentLoader: Unknown componentId "${componentId}"`));
    }
    return from(definition.loadComponent());
  }
}
