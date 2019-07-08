import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appExpandableDetails]'
})
export class ExpandableDetailsDirective implements OnInit {

  constructor(
    public element: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngOnInit() {
    this.renderer.addClass(this.element.nativeElement, 'expandable-details');
    this.renderer.addClass(this.element.nativeElement, 'details-collapsed');
  }

}
