import { Injectable } from '@angular/core';
import { TopSearchModule } from './top-search.module';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: TopSearchModule
})
export class TopSearchService {
  public clearSearchEvent = new Subject();

  constructor() { }

  clearSearch(): void {
    this.clearSearchEvent.next();
  }
}
