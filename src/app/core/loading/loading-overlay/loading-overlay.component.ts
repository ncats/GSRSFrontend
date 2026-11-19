import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-loading-overlay',
    template: `<div></div>`,
    styleUrls: ['./loading-overlay.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingOverlayComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
