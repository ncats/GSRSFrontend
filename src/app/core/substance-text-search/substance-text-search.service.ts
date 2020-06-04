import { Injectable } from '@angular/core';
import { SubstanceTextSearchModule } from './substance-text-search.module';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: SubstanceTextSearchModule
})
export class SubstanceTextSearchService {
  private registeredSearchComponents: { [id: string]: Subject<void> } = {};

  constructor() { }

  registerSearchComponent(id: string): void {
    this.registeredSearchComponents[id] = new Subject<void>();
  }

  cleanSearchComponentEvent(id: string): Observable<void> {
    return this.registeredSearchComponents[id].asObservable();
  }

  unregisterSearchComponent(id: string): void {
    this.registeredSearchComponents[id].complete();
    this.registeredSearchComponents[id] = null;
  }

  clearSearch(id: string): void {
    if (this.registeredSearchComponents[id]) {
      this.registeredSearchComponents[id].next();
    }
  }
}
