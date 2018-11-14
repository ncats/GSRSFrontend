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
  structureEditor = environment.structureEditor;
  private jsdrawScriptUrls = [
    '/node_modules/dojo/dojo.js',
    '/assets/jsdraw/Scilligence.JSDraw2.Pro.js',
    '/assets/jsdraw/Scilligence.JSDraw2.Resources.js'
  ];

  constructor() { }

  ngOnInit() {

    if (environment.structureEditor === 'jsdraw' && !window['JSDraw']) {

      // this is extremely hacky but no way around it

      const defaultDocumentWriteFunction = document.write;

      document.write = (content) => {
        if (content === '<style type="text/css">input._scil_dropdown::-ms-clear {display: none;}</style>') {
          const styleElement = document.createElement('style');
          styleElement.type = 'text/css';
          styleElement.innerHTML = 'input._scil_dropdown::-ms-clear {display: none;}';
          document.getElementsByTagName('head')[0].appendChild(styleElement);
        } else {
          defaultDocumentWriteFunction(content);
        }
      };

      for (let i = 0; i < this.jsdrawScriptUrls.length; i++) {
        const node = document.createElement('script');
        node.src = this.jsdrawScriptUrls[i];
        node.type = 'text/javascript';
        node.async = false;
        node.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(node);
      }
    }
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
