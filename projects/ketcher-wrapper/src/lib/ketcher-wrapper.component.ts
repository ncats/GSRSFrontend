import { Component, OnInit, ViewChild, Input, Output, EventEmitter, ElementRef, AfterViewInit, Renderer2, HostListener } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Ketcher } from './ketcher.model';

@Component({
  selector: 'ncats-ketcher-wrapper',
  templateUrl: './ketcher-wrapper.component.html',
  styleUrls: ['./ketcher-wrapper.component.scss']
})
export class KetcherWrapperComponent implements OnInit, AfterViewInit {
  @ViewChild('ketcherFrame', { static: true }) ketcherFrame: { nativeElement: HTMLIFrameElement };
  @Output() ketcherOnLoad = new EventEmitter<any>();
  safeKetcherFilePath: SafeUrl;
  @ViewChild('ketcherBody') kBod: ElementRef;
  @ViewChild('ketcherFrame') iframe: ElementRef;
  iframeMouseOver = false;
  constructor(
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {

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
    };
   // this.renderer.listen(window, 'blur', () => this.onWindowBlur());*/
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

}
