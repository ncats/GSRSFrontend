import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Ketcher } from './ketcher.model';

@Component({
  selector: 'ncats-ketcher-wrapper',
  templateUrl: './ketcher-wrapper.component.html',
  styleUrls: ['./ketcher-wrapper.component.scss']
})
export class KetcherWrapperComponent implements OnInit {
  @ViewChild('ketcherFrame') ketcherFrame: { nativeElement: HTMLIFrameElement };
  @Input() ketcherFilePath: string;
  @Output() ketcherOnLoad = new EventEmitter<Ketcher>();
  safeKetcherFilePath: SafeUrl;

  constructor(
    private sanitizer: DomSanitizer
  ) {

  }

  ngOnInit() {
    this.safeKetcherFilePath = this.sanitizer.bypassSecurityTrustResourceUrl(this.ketcherFilePath);
    this.ketcherFrame.nativeElement.onload = () => {
      this.ketcherOnLoad.emit(this.ketcherFrame.nativeElement.contentWindow['ketcher']);
      console.log(this.ketcherFrame.nativeElement.contentWindow['ketcher']);
    };
  }

}
