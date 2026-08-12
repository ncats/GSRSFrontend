import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-nitrosamine-standalone',
    templateUrl: './nitrosamine-standalone.component.html',
    styleUrls: ['./nitrosamine-standalone.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NitrosamineStandaloneComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
