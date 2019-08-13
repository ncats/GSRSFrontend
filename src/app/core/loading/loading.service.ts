import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LoadingService {
  private isLoading = false;
  loadingEvent: Subject<boolean> = new Subject();
  numProcesses = 0;

  constructor() { }

  setLoading(isLoading: boolean): void {
    if (isLoading) {
      this.numProcesses++;
    } else {
      this.numProcesses--;
    }
    this.isLoading = this.numProcesses > 0;
    this.loadingEvent.next(this.isLoading);
  }

  resetLoading(): void {
    this.isLoading = false;
    this.numProcesses = 0;
    this.loadingEvent.next(this.isLoading);
  }
}
