import { Directive, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { ScrollToService } from './scroll-to.service';

@Directive({
  selector: '[appScrollToTarget]'
})
export class ScrollToTargetDirective implements AfterViewInit, OnDestroy {

  constructor(
    private elementRef: ElementRef,
    private scrollToService: ScrollToService
  ) {
  }

  ngAfterViewInit() {
    if (this.elementRef.nativeElement.id != null) {
      this.scrollToService.registerTargetElement(this.elementRef.nativeElement);
    }
  }

  ngOnDestroy() {
    this.scrollToService.unregisterTargetElement(this.elementRef.nativeElement);
  }

}
