import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { StructureEditorModule } from '@gsrs-core/structure-editor';
import { NitrosamineDisplayComponent } from './nitrosamine-display/nitrosamine-display.component';

@Component({
    selector: 'app-nitrosamine-standalone',
    templateUrl: './nitrosamine-standalone.component.html',
    styleUrls: ['./nitrosamine-standalone.component.scss'],
    standalone: true,
    imports: [MatCardModule, StructureEditorModule, NitrosamineDisplayComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NitrosamineStandaloneComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
