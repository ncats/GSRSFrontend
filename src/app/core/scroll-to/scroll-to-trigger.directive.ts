import {
  Directive,
  Input,
  AfterViewInit,
  ElementRef
} from '@angular/core';

@Directive({
  selector: '[appScrollNavItem]'
})
export class ScrollToTriggerDirective implements AfterViewInit {
  @Input() scrollToElementId: string;
  scrollToElement: HTMLElement;

  constructor(
    private navItemElement: ElementRef
  ) { }

  ngAfterViewInit() {
    if (this.scrollToElementId != null) {
      this.getScrollToElement();
    } else {
      console.error('You need to enter a value for scrollToElementId');
    }
  }

  getScrollToElement() {
    setTimeout(() => {
      this.scrollToElement = document.getElementById(this.scrollToElementId);
      if (this.scrollToElement == null) {
        console.error('You did not enter a valid element Id in scrollToElementId');
      } else {
        this.navItemElement.nativeElement.onclick = () => {
          this.scrollToElement.scrollIntoView({behavior: 'smooth'});
        };
      }
    });

  }
}
