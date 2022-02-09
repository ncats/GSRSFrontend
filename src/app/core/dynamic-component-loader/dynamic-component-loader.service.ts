import {
  ComponentFactory,
  Inject,
  Injectable,
  Injector,
  NgModuleFactory,
  Compiler,
  createNgModuleRef
} from '@angular/core';
import { from, Observable, throwError, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import {
  DYNAMIC_COMPONENT,
  LAZY_LOADED_COMPONENT_MANIFESTS,
  DYNAMIC_MODULE,
  LazyLoadedComponentManifest,
} from './dynamic-component-manifest';

@Injectable()
export class DynamicComponentLoader {

  constructor(
    @Inject(LAZY_LOADED_COMPONENT_MANIFESTS) private manifests: LazyLoadedComponentManifest[],
    private injector: Injector,
    private compiler: Compiler
  ) {
  }

  /**
   *  Retrieve a ComponentFactory, based on the specified componentId
   *  (defined in the DynamicComponentManifest array).
   *
   * @template T
   * @param componentId
   * @param injector
   * @returns
   * @memberof DynamicComponentLoader
   */
  getComponentFactory<T>(componentId: string, injector?: Injector): Observable<ComponentFactory<T>> {
    const manifestsFlat = this.manifests.reduce((acc, val) => acc.concat(val), []);
    const manifest = manifestsFlat
      .find(m => m.componentId === componentId);
    if (!manifest) {
      return throwError(`DynamicComponentLoader: Unknown componentId "${componentId}"`);
    }

    const path = manifest.loadChildren;

    if (!path) {
      throw new Error(`${componentId} unknown!`);
    }

    return this._wrapIntoObservable(path()).pipe(mergeMap((t: any) => {
      // let moduleFactory = null;
      const offlineMode = this.compiler instanceof Compiler;
      //  true means AOT enalbed compiler (Prod build), false means JIT enabled compiler (Dev build)
      // moduleFactory = offlineMode ? t : this.compiler.compileModuleSync(t);
      return this.loadFactory<T>(t, componentId, injector);
    }));
  }

  /**
   * Load the factory object
   *
   * @template T
   * @param ngModuleFactory
   * @param componentId
   * @param injector
   * @returns
   * @memberof DynamicComponentLoader
   */
  loadFactory<T>(module: any, componentId: string, injector?: Injector): Promise<ComponentFactory<T>> {
    const moduleRef = createNgModuleRef(module, injector || this.injector);
    const dynamicComponentType = moduleRef.injector.get(DYNAMIC_COMPONENT, null);
    if (!dynamicComponentType) {
      const dynamicModule: LazyLoadedComponentManifest = moduleRef.injector.get(DYNAMIC_MODULE, null);

      if (!dynamicModule) {
        throw new Error(
          'DynamicComponentLoader: Dynamic module for'
          + ` componentId "${componentId}" does not contain`
          + ' DYNAMIC_COMPONENT or DYNAMIC_MODULE as a provider.',
        );
      }
      if (dynamicModule.componentId !== componentId) {
        throw new Error(
          'DynamicComponentLoader: Dynamic module for'
          + `${componentId} does not match manifest.`,
        );
      }

      const path = dynamicModule.loadChildren as any;

      if (!path) {
        throw new Error(`${componentId} unknown!`);
      }

      return this._wrapIntoObservable(path()).pipe(mergeMap((t: any) => {
        let moduleFactory = null;
        const offlineMode = this.compiler instanceof Compiler;
        //  true means AOT enalbed compiler (Prod build), false means JIT enabled compiler (Dev build)
        moduleFactory = offlineMode ? t : this.compiler.compileModuleSync(t);
        return this.loadFactory<T>(moduleFactory, componentId, injector);
      })).toPromise();
    }

    return Promise.resolve(moduleRef.componentFactoryResolver.resolveComponentFactory<T>(dynamicComponentType));
  }

  /**
  * Get the value as an observable
  *
  * @template T
  * @param value
  * @returns
  * @memberof LibConfigService
  */
  private _wrapIntoObservable<T>(value: T | NgModuleFactory<T> | Promise<T> | Observable<T>) {
    if (value instanceof Observable) {
      return value;
    } else if (value instanceof Promise) {
      return from(value);
    } else {
      return of(value);
    }
  }
}
