import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { JSDraw } from './jsdraw';

@Component({
  selector: 'ncats-jsdraw-wrapper',
  template: `<div id="sketcherForm" dataformat="molfile"></div>`,
  styles: []
})
export class JsdrawWrapperComponent implements OnInit {
  private jsdraw: JSDraw;
  @Output() jsDrawOnLoad = new EventEmitter<JSDraw>();

  constructor() { }

  ngOnInit() {
    let isDojoLoading = true;
    let count = 0;

    while (isDojoLoading && count < 5000) {
      if (window['dojo']) {
        window['dojo'].addOnLoad(() => {
          this.jsdraw = new window['JSDraw']('sketcherForm');
          this.jsDrawOnLoad.emit(this.jsdraw);
        });
        isDojoLoading = false;
      }
      count++;
    }
  }

}
