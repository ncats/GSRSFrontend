import { ChangeDetectionStrategy, Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef, AfterViewInit, Renderer2, HostListener } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'ncats-ketcher-wrapper',
    templateUrl: './ketcher-wrapper.component.html',
    styleUrls: ['./ketcher-wrapper.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class KetcherWrapperComponent implements OnInit, AfterViewInit {
  @ViewChild('ketcherFrame', { static: true }) ketcherFrame: { nativeElement: HTMLIFrameElement };
  @Output() ketcherOnLoad = new EventEmitter<any>();
  randomId: string;
  safeKetcherFilePath: SafeUrl;
  @ViewChild('ketcherBody') kBod: ElementRef;
  @ViewChild('ketcherFrame') iframe: ElementRef;
  iframeMouseOver = false;
  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {
    this.randomId = Math.random().toString(36).replace('0.', '');
  }

  ngOnInit() {
  
  }

  ngAfterViewInit() {
  /*  let doc = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;

    this.ketcherFrame.nativeElement.onload = () => {
      this.executeOnceNotNullOrUndefined(() => this.ketcherFrame.nativeElement.contentWindow['ketcher'], (obj) => {
        this.ketcherOnLoad.emit(obj);
    });
        
    //  let doc = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
    };*/
    this.renderer.listen(window, 'blur', () => this.onWindowBlur());
  }


  executeOnceNotNullOrUndefined<T>(objProvider: () => T | null | undefined, callback: (obj: T) => void, interval: number = 100): void {
    const intervalId = setInterval(() => {
        const obj = objProvider();
        if (obj !== null && obj !== undefined) {
            clearInterval(intervalId);
            callback(obj);
        }
    }, interval);
}
@HostListener('mouseover')
onIframeMouseOver() {
  this.iframeMouseOver = true;
  this.resetFocusOnWindow();
}

@HostListener('mouseout')
onIframeMouseOut() {
  this.iframeMouseOver = false;
  this.resetFocusOnWindow();
}

@HostListener('click')
onClick() {
 // this.iframeMouseOver = false;
 setTimeout(() => {
  this.resetFocusOnWindow();
 }, 100);
}

private onWindowBlur() {
  if (this.iframeMouseOver) {
    this.resetFocusOnWindow();
  }
}

private resetFocusOnWindow() {
  setTimeout(() => {
   
    window.focus();
  }, 100);
}
}
