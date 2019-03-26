import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoadingService {
  private isLoading = false;
  loadingEvent: Subject<boolean> = new Subject();

  constructor() { }

  setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.loadingEvent.next(this.isLoading);
  }
}
