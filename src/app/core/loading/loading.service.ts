import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { OverlayContainer, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoading = false;
  private loadingEventSubject: Subject<boolean> = new Subject();
  numProcesses = 0;
  private overlayRef: OverlayRef;
  private loadingPortal: ComponentPortal<LoadingOverlayComponent>;
  private overlayContainer: HTMLElement;

  constructor(
    private overlayService: Overlay,
    private overlayContainerService: OverlayContainer,
  ) {
    this.overlayRef = this.overlayService.create({
      hasBackdrop: true,
      backdropClass: 'loading-overlay-backdrop',
      positionStrategy: this.overlayService.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: this.overlayService.scrollStrategies.reposition()
    });
    this.loadingPortal = new ComponentPortal<LoadingOverlayComponent>(LoadingOverlayComponent);
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

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

    if (this.isLoading) {
      this.setOverlay();
    } else {
      this.removeOverlay();
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

  private setOverlay(): void {
    this.overlayRef.attach(this.loadingPortal);
    this.overlayContainer.style.zIndex = '1002';
  }

  private removeOverlay(): void {
    this.overlayRef.detach();
    this.overlayContainer.style.zIndex = null;
  }
}
