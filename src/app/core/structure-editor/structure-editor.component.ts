import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  PLATFORM_ID,
  Inject,
  OnDestroy,
  ViewChild,
  ElementRef, AfterViewInit, HostListener
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Ketcher } from 'ketcher-wrapper';
import { EditorImplementation } from './structure-editor-implementation.model';
import { JSDraw } from 'jsdraw-wrapper';
import { environment } from '../../../environments/environment';
import { StructureService } from '@gsrs-core/structure';
import { LoadingService } from '@gsrs-core/loading';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-structure-editor',
  templateUrl: './structure-editor.component.html',
  styleUrls: ['./structure-editor.component.scss']
})
export class StructureEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  editor: EditorImplementation;
  @Output() editorOnLoad = new EventEmitter<EditorImplementation>();
  @Output() loadedMolfile = new EventEmitter<string>();
  private ketcher: Ketcher;
  private jsdraw: JSDraw;
  structureEditor: string;
  anchorElement: HTMLAnchorElement;
  smiles: string;
  mol: string;
  height = 0;
  width = 0;
  canvasToggle = true;
  canvasMessage = '';
  tempClass = "";
  @ViewChild('structure_canvas', { static: false }) myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;
  public canvasCopy: HTMLCanvasElement;
  private jsdrawScriptUrls = [
    `${environment.baseHref || ''}assets/dojo/dojo.js`,
    `${environment.baseHref || ''}assets/jsdraw/Scilligence.JSDraw2.Pro.js`,
    `${environment.baseHref || ''}assets/jsdraw/Scilligence.JSDraw2.Resources.js`,
    `${environment.baseHref || ''}assets/jsdraw/JSDraw.extensions.js`

  ];
  ketcherFilePath: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private structureService: StructureService,
    private loadingService: LoadingService,
    private elementRef: ElementRef
  ) { }

  ngOnDestroy(): void {
    window.removeEventListener('drop', this.preventDrag);
    window.removeEventListener('dragover', this.preventDrag);
    window.removeEventListener('paste', this.checkPaste);
    (<HTMLCanvasElement>this.myCanvas.nativeElement).removeEventListener('click', this.click);

  }

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
    this.canvasCopy = <HTMLCanvasElement>this.myCanvas.nativeElement;
    const test = (<HTMLCanvasElement>this.myCanvas.nativeElement);
    if (test) {
      test.addEventListener('click', this.click);
    }
  }

  @HostListener('paste', ['$event']) private paster(event: any) {
   // console.log('host paste');
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    this.catchPaste(event);
  }

  @HostListener('drop', ['$event']) private dropper(event: any) {
  //  console.log('drop');
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }

  @HostListener('dragover', ['$event']) private dragger(event: DragEvent) {
   // console.log('drag');
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }


  private preventDrag = (event: DragEvent) => {
   // console.log('prevent drag');
    event.preventDefault();
  }

// override JSDraw for Molvec paste event. Using the JSDraw menu copy function seems to ignore this at first
  checkPaste = (event: ClipboardEvent ) => {
   // console.log('checkPaste');
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    if (this.jsdraw && this.jsdraw.activated) {
      this.catchPaste(event);
    }
    else if (this.ketcher) {
      this.catchPaste(event);
    }
  }


// when a dialog is opened / z-index changes occur, the editor loses it's reference this resets it when it's focused
// there is probably a better way of doing this by applying something to all dialog close events. you must first set it to 0 to take
  click = (event: Event ) => {
    this.tempClass = 'high';
    setTimeout(() => {
      this.tempClass = 'higher';
    }, 10);
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

      

      window.addEventListener('dragover', this.preventDrag);
      window.addEventListener('drop', this.preventDrag);
    //  window.addEventListener('paste', this.checkPaste);

      this.ketcherFilePath = `${environment.baseHref || ''}assets/ketcher/index.html`;

      this.structureEditor = environment.structureEditor;

      if ( !window['JSDraw']) {

        // this is extremely hacky but no way around it

        const defaultDocumentWriteFunction = document.write;

        document.write = (content) => {
          if (content === '<style type="text/css">input._scil_dropdown::-ms-clear {display: none;}</style>') {
            const styleElement = document.createElement('style');
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
          document.getElementsByTagName('head')[0].appendChild(node);
        }
      }
    }
  }

  ketcherOnLoad(ketcher: any): void {

    setTimeout(() => {
       this.ketcher = ketcher;
       if (this.structureEditor === 'ketcher'){

       this.editor = new EditorImplementation(this.ketcher);
       this.editorOnLoad.emit(this.editor);
       }
       
    }, 1000);

  }

  toggleEditor() {
    
    if (this.structureEditor === 'ketcher' ) {
      this.structureEditor = 'jsdraw';
      this.editor = new EditorImplementation(null, this.jsdraw);
      this.editorOnLoad.emit(this.editor);
    } else {
      this.structureEditor = 'ketcher';
      this.editor = new EditorImplementation(this.ketcher, null);
       this.editorOnLoad.emit(this.editor);
       console.log(this.jsdraw.options);
    }
  }

  jsDrawOnLoad(jsdraw: JSDraw): void {
    console.log('loaded');
    this.jsdraw = jsdraw;
    if (this.structureEditor === 'jsdraw'){
      this.editor = new EditorImplementation(null, this.jsdraw);
      this.editorOnLoad.emit(this.editor);
    }
    
  }

  get _jsdrawScriptUrls(): Array<string> {
    return this.jsdrawScriptUrls;
  }

  onDropHandler(object: any): void {
    if (object.invalidFlag) {
      this.canvasMessage = 'The selected file could not be read';
    } else {
      const img = object.event.target.result;
      this.createImage(img);
    }
  }


  sendToMolvec(img: string) {
    this.canvasMessage = '';
    this.loadingService.setLoading(true);
    this.structureService.molvec(img).subscribe(response => {
      const mol = response.molfile;
      this.loadedMolfile.emit(mol);
      this.loadingService.setLoading(false);
    }, error => {
      this.canvasMessage = 'Structure not detectable';
      this.loadingService.setLoading(false);
    });
  }

  createImage(url: string): void {
    const img = new Image;
    img.src = url;
    img.onload = () => {
      this.canvasToggle = true;
      this.height = img.height;
      this.width = img.width;
      setTimeout(() => {
        // drawing on canvas and using it to get another data url yields better results.
        this.context.drawImage(img, 0, 0, img.width, img.height);
        url = this.canvasCopy.toDataURL();
        setTimeout(() => {
          // compress data url to below molvec max
          if (url.length > 100000) {
            url = this.canvasCopy.toDataURL('image/jpeg', 100000 / url.length);
          }
          this.context.clearRect(0, 0, this.canvasCopy.width, this.canvasCopy.height);
          while ((img.height > 700) || (img.width > 900)) {
            img.height = img.height * .9;
            img.width = img.width * .9;
          }
          this.canvasCopy.width = img.width;
          this.canvasCopy.height = img.height;
          this.context.drawImage(img, 0, 0, img.width, img.height);
          this.sendToMolvec(url);
        });
      });
    };
  }

  catchPaste(event: ClipboardEvent): void {
    const send: any = {};
    let valid = false;
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const blob = items[i].getAsFile();
      if (items[i].type.indexOf('image') !== -1) {
        event.preventDefault();
        event.stopPropagation();
        valid = true;
        send.type = 'image';
        const reader = new FileReader();
        send.file = blob;
        reader.readAsDataURL(blob);
        const that = this;
        reader.onloadend = () => {
          setTimeout(() => {
            const img = reader.result.toString();
            that.createImage(img);
          });
        };
      } else if (items[i].type === 'text/plain') {
        const text = event.clipboardData.getData('text/plain');
        if (text.indexOf('<div') === -1) {
          event.preventDefault();
          event.stopPropagation();
          this.structureService.interpretStructure(text).subscribe(response => {
            if (response.structure && response.structure.molfile) {
              this.loadedMolfile.emit(response.structure.molfile);
            }
          });
        }
      }
    }


  }

  cleanStructure() {
    let molfile ='';
    this.editor.getMolfile().subscribe(response => {
      molfile = response;
    if (molfile != null && molfile !== '') {
      this.structureService.interpretStructure(molfile).pipe(take(1)).subscribe(response => {
        if (response && response.structure && response.structure.smiles) {
          this.cleanStructureSmiles(response.structure.smiles);
        }
      });
    }
  });
  }

  cleanStructureSmiles(smiles: string) {
    if (smiles != null && smiles !== '') {
      this.structureService.interpretStructure(smiles).pipe(take(1)).subscribe(response => {
        if (response && response.structure && response.structure.molfile) {
          this.editor.setMolecule(response.structure.molfile);
        }
      });
    }
  }


  standardize(standard: string): void {
    this.loadingService.setLoading(true);
    let mol ='';
    this.editor.getMolfile().pipe(take(1)).subscribe(response => {
      mol = response;
    this.structureService.interpretStructure(mol, '', standard).pipe(take(1)).subscribe((response: any) => {
      if (response && response.structure && response.structure.molfile) {
        this.editor.setMolecule(response.structure.molfile);
      }
      this.loadingService.setLoading(false);
    }, () => {this.loadingService.setLoading(false); });
  });
}

}
