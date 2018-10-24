import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ketcher } from 'ketcher-wrapper/ketcher-wrapper';
import { EditorImplementation } from './structure-editor-implementation.model';

@Component({
  selector: 'app-structure-editor',
  templateUrl: './structure-editor.component.html',
  styleUrls: ['./structure-editor.component.scss']
})
export class StructureEditorComponent implements OnInit {
  @Output() editorOnLoad = new EventEmitter<any>();
  private ketcher: Ketcher;

  constructor() { }

  ngOnInit() {
  }

  ketcherOnLoad(ketcher: Ketcher): void {
    this.ketcher = ketcher;
    this.editorOnLoad.emit(new EditorImplementation(this.ketcher));
  }

}
