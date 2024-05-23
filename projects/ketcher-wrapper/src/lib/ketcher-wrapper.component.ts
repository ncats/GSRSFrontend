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
  @Input() ketcherFilePath: string;
  @Output() ketcherOnLoad = new EventEmitter<Ketcher>();
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
    this.safeKetcherFilePath = this.sanitizer.bypassSecurityTrustResourceUrl(this.ketcherFilePath);
    this.ketcherFrame.nativeElement.onload = () => {
     setTimeout(() => {
        this.ketcherOnLoad.emit(this.ketcherFrame.nativeElement.contentWindow['ketcher']);
      let doc = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
    }, 10);
    };
  }

  ngAfterViewInit() {
    let doc = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
   // this.renderer.listen(window, 'blur', () => this.onWindowBlur());
  }

  
/* Disabling molvec for ketcher for now to reduce headaches since JSdraw is still loaded
  @HostListener('mouseover')
  private onIframeMouseOver() {
    this.iframeMouseOver = true;
    this.resetFocusOnWindow();
  }

  @HostListener('mouseout')
  private onIframeMouseOut() {
    this.iframeMouseOver = false;
    this.resetFocusOnWindow();
  }

  @HostListener('dragover', ['$event']) private dragger(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.resetFocusOnWindow();
  }

  @HostListener('drop', ['$event']) private dropper(event: any) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.resetFocusOnWindow();
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
  }*/


}
