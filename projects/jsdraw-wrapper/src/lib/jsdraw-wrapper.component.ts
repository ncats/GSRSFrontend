import { Component, AfterViewInit, Output, EventEmitter, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { JSDraw } from './jsdraw';

@Component({
  selector: 'ncats-jsdraw-wrapper',
  template: `<div [id]="randomId" dataformat="molfile"></div>`,
  styles: []
})
export class JsdrawWrapperComponent implements AfterViewInit {
  randomId: string;
  private jsdraw: JSDraw;
  @Output() jsDrawOnLoad = new EventEmitter<JSDraw>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.randomId = Math.random().toString(36).replace('0.', '');
  }

  ngAfterViewInit() {
    this.loadEditor();
  }

  loadEditor(): void {
    let count = 0;

    if (isPlatformBrowser(this.platformId)) {
      //this will ensure that the extra resources file has been loaded before the full editor is
      if (window['JSDraw'] && window['dojo'] && window['scil'] && window['scil'].Utils && window['scil'].Utils._loadedAdditions) {
        window['dojo'].ready(() => {
          this.jsdraw = new window['JSDraw'](this.randomId);
          this.jsDrawOnLoad.emit(this.jsdraw);
          // customization of buttons
          if(window['afterSketcherMade']){
            window['afterSketcherMade']();
          }
        });
      } else if (count < 5000) {
        count++;
        setTimeout(() => {
          this.loadEditor();
        }, 10);
      }
    }
  }
}
