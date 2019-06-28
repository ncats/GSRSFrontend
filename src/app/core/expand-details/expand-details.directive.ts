import { Directive, Input, ElementRef, HostListener, Renderer2, AfterViewInit, ContentChild } from '@angular/core';
import { ExpandableDetailsDirective } from './expandable-details.directive';

@Directive({
  selector: '[appExpandDetails]',
})
export class ExpandDetailsDirective implements AfterViewInit {
  private focused = 0;
  private isExpanded = false;
  private isHovering = false;
  private expandableDetailsElement: Element;
  private timerToExpand: any;
  private timerToCollapse: any;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit() {
  }

  @ContentChild(ExpandableDetailsDirective)
  set expandableDetails(expandableDetails: ExpandableDetailsDirective) {
    this.expandableDetailsElement = expandableDetails.element.nativeElement;
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.isHovering = true;
    if (!this.isExpanded) {
      clearTimeout(this.timerToExpand);
      clearTimeout(this.timerToCollapse);
      this.timerToExpand = setTimeout(() => {
        this.expandDetails();
        this.timerToExpand = null;
      }, 1000);
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.isHovering = false;
    clearTimeout(this.timerToExpand);
    if (this.isExpanded && !this.focused) {
      clearTimeout(this.timerToCollapse);
      this.timerToCollapse = setTimeout(() => {
        this.collapseDetails();
        this.timerToCollapse = null;
      }, 1000);
    }
  }

  @HostListener('focusin') onFocusin() {
    this.focused++;
    clearTimeout(this.timerToExpand);
    clearTimeout(this.timerToCollapse);
    if (!this.isExpanded) {
      this.expandDetails();
    }
  }
  @HostListener('focusout') onFocusout() {
    this.focused--;
    if (!this.isHovering && !this.focused) {
      clearTimeout(this.timerToExpand);
      clearTimeout(this.timerToCollapse);
      this.timerToCollapse = setTimeout(() => {
        this.collapseDetails();
      }, 1000);
    }
  }

  private expandDetails(): void {
    this.renderer.addClass(this.expandableDetailsElement, 'details-expanded');
    this.renderer.removeClass(this.expandableDetailsElement, 'details-collapsed');
    this.isExpanded = true;
  }

  private collapseDetails(): void {
    this.renderer.addClass(this.expandableDetailsElement, 'details-collapsed');
    this.renderer.removeClass(this.expandableDetailsElement, 'details-expanded');
    this.isExpanded = false;
  }
}
