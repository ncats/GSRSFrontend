import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { JSDraw } from './jsdraw';

@Component({
  selector: 'ncats-jsdraw-wrapper',
  template: `<div [id]="randomId" dataformat="molfile"></div>`,
  styles: []
})
export class JsdrawWrapperComponent implements OnInit {
  randomId: string;
  private jsdraw: JSDraw;
  @Output() jsDrawOnLoad = new EventEmitter<JSDraw>();

  constructor() {
    this.randomId = Math.random().toString(36).replace('0.', '');
  }

  ngOnInit() {
    this.loadEditor();
  }

  loadEditor(): void {
    let count = 0;

    if (window['JSDraw'] && window['dojo']) {
      window['dojo'].ready(() => {
        this.jsdraw = new window['JSDraw'](this.randomId);
        this.jsDrawOnLoad.emit(this.jsdraw);
      });
    } else if (count < 5000) {
      count++;
      setTimeout(() => {
        this.loadEditor();
      }, 10);
    }
  }
}
