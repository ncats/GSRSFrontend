import {
  Directive,
  Input,
  AfterViewInit,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { ScrollToRegistration } from './scroll-to-registration.class';
import { ScrollToService } from './scroll-to.service';

@Directive({
  selector: '[appScrollToTrigger]'
})
export class ScrollToTriggerDirective implements AfterViewInit, OnDestroy {
  @Input() scrollToElementId: string;
  @Input() vAlign: 'start' | 'center' | 'end' | 'nearest' | 'start' = 'center';
  scrollToElement: HTMLElement;
  triggerElementRegistration: ScrollToRegistration;

  constructor(
    private elementRef: ElementRef,
    private scrollToService: ScrollToService
  ) { }

  ngAfterViewInit() {
    if (this.scrollToElementId != null) {
      this.registerTriggerElement();
    } else {
      console.error('You need to enter a value for scrollToElementId');
    }
  }

  ngOnDestroy() {
    this.triggerElementRegistration.unregister();
  }

  registerTriggerElement(): void {
    this.triggerElementRegistration
      = this.scrollToService.registerTriggerElement(this.scrollToElementId, this.elementRef.nativeElement, this.vAlign);
  }
}
