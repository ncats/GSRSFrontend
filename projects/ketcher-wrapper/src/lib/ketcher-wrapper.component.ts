import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'ncats-ketcher-wrapper',
  templateUrl: './ketcher-wrapper.component.html',
  styleUrls: ['./ketcher-wrapper.component.scss']
})
export class KetcherWrapperComponent implements OnInit {
  @ViewChild('ketcherFrame') ketcherFrame: { nativeElement: HTMLIFrameElement };

  constructor() { }

  ngOnInit() {
    console.log(this.ketcherFrame);
  }

}
