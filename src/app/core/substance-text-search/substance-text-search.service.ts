import { Injectable } from '@angular/core';
import { SubstanceTextSearchModule } from './substance-text-search.module';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: SubstanceTextSearchModule
})
export class SubstanceTextSearchService {
  public clearSearchEvent = new Subject();

  constructor() { }

  clearSearch(): void {
    this.clearSearchEvent.next();
  }
}
