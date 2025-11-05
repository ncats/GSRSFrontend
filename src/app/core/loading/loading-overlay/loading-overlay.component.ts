import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-loading-overlay',
    template: `<div></div>`,
    styleUrls: ['./loading-overlay.component.scss'],
    standalone: false
})
export class LoadingOverlayComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
