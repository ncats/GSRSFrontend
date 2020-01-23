import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoading = false;
  private loadingEventSubject: Subject<boolean> = new Subject();
  numProcesses = 0;

  constructor() { }

  setLoading(isLoading: boolean): void {
    if (isLoading) {
      this.numProcesses++;
    } else {
      this.numProcesses--;
    }
    this.isLoading = this.numProcesses > 0;
    if (this.numProcesses < 0) {
      this.numProcesses = 0;
    }
    this.loadingEventSubject.next(this.isLoading);
  }

  resetLoading(): void {
    this.isLoading = false;
    this.numProcesses = 0;
    this.loadingEventSubject.next(this.isLoading);
  }

  get loadingEvent(): Observable<boolean> {
    return this.loadingEventSubject.asObservable();
  }
}
