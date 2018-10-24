import { Component, OnInit } from '@angular/core';
import { JSDraw } from './jsdraw';

@Component({
  selector: 'ncats-jsdraw-wrapper',
  template: `<div id="sketcherForm" dataformat="molfile"></div>`,
  styles: []
})
export class JsdrawWrapperComponent implements OnInit {
  private jsdraw: JSDraw;

  constructor() { }

  ngOnInit() {
    this.jsdraw = new JSDraw('sketcherForm');
    console.log(this.jsdraw);
  }

}
