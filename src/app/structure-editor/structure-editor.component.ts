import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Ketcher } from 'ketcher-wrapper/ketcher-wrapper';
import { EditorImplementation } from './structure-editor-implementation.model';
import { JSDraw } from 'jsdraw-wrapper/jsdraw-wrapper';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-structure-editor',
  templateUrl: './structure-editor.component.html',
  styleUrls: ['./structure-editor.component.scss']
})
export class StructureEditorComponent implements OnInit {
  @Output() editorOnLoad = new EventEmitter<any>();
  private ketcher: Ketcher;
  private jsdraw: JSDraw;
  structureEditor =  environment.structureEditor;

  constructor() { }

  ngOnInit() {
  }

  ketcherOnLoad(ketcher: Ketcher): void {
    this.ketcher = ketcher;
    this.editorOnLoad.emit(new EditorImplementation(this.ketcher));
  }

  jsDrawOnLoad(jsdraw: JSDraw): void {
    this.jsdraw = jsdraw;
    this.editorOnLoad.emit(new EditorImplementation(null, this.jsdraw));
  }

}
