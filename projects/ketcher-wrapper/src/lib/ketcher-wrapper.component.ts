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
      console.log('upd2');
      console.log(this.ketcherFrame.nativeElement);
      this.ketcherFrame.nativeElement.contentWindow['ketcher'].body.attachEvent('onpaste', function(e) {
        alert("paste");
    });
    this.kBod.nativeElement.addEventListener('paste', function(e) {
      alert("pasteaddevent");
     });
     this.kBod.nativeElement.attachEvent('onpaste', function(e) {
      alert("pasteattach");
     });
     let doc = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
     if (typeof doc.addEventListener !== undefined) {
      doc.addEventListener("click", this.iframeClickHandler, false)
    } else if (typeof doc.attachEvent !== undefined) {
      doc.attachEvent("onclick", this.iframeClickHandler);
    }
    }
     
     , 1000) 
    };
  }

  ngAfterViewInit() {
    let doc = this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
    if (typeof doc.addEventListener !== undefined) {
      doc.addEventListener("click", this.iframeClickHandler, false)
    } else if (typeof doc.attachEvent !== undefined) {
      doc.attachEvent("onclick", this.iframeClickHandler);
    }
    this.renderer.listen(window, 'blur', () => this.onWindowBlur());
    this.renderer.listen(window, 'focus', () => console.log('window focus'));
  }

  iframeClickHandler() {
    alert("Iframe clicked");
  }

  @HostListener('mouseover')
  private onIframeMouseOver() {
   // this.log('Iframe mouse over');
    this.iframeMouseOver = true;
    this.resetFocusOnWindow();
  }

  @HostListener('mouseout')
  private onIframeMouseOut() {
   // this.log('Iframe mouse out');
    this.iframeMouseOver = false;
    this.resetFocusOnWindow();
  }

  @HostListener('dragover', ['$event']) private dragger(event: DragEvent) {
  //  console.log('Wdrag');
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.resetFocusOnWindow();
  }

  @HostListener('drop', ['$event']) private dropper(event: any) {
   // console.log('Wdrop');
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.resetFocusOnWindow();
  }

  private onWindowBlur() {
    if (this.iframeMouseOver) {
     // console.log('');
      this.resetFocusOnWindow();
    }
  }

  private resetFocusOnWindow() {
    setTimeout(() => {
     
      window.focus();
    }, 100);
  }


}
