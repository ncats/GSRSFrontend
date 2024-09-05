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
import { ConfigService } from '@gsrs-core/config';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { MolvecModalComponent } from './molvec-modal/molvec-modal/molvec-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-structure-editor',
  templateUrl: './structure-editor.component.html',
  styleUrls: ['./structure-editor.component.scss']
})
export class StructureEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  editor: EditorImplementation;
  @Output() editorOnLoad = new EventEmitter<EditorImplementation>();
  @Output() loadedMolfile = new EventEmitter<string>();
  @Output() editorSwitched = new EventEmitter<string>();

  private ketcher: any;
  private jsdraw: JSDraw;
  ketcherLoaded = false;
  jsdrawLoaded = false;
  structureEditor: string;
  anchorElement: HTMLAnchorElement;
  smiles: string;
  mol: string;
  height = 0;
  width = 0;
  canvasToggle = true;
  canvasMessage = '';
  tempClass = "";
  enableJSDraw = true;
  enableKetcher = true;
  private overlayContainer: HTMLElement;

  @ViewChild('structure_canvas', { static: false }) myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;
  public canvasCopy: HTMLCanvasElement;
  public substanceFormService: SubstanceFormService;
  private jsdrawScriptUrls = [
    `${environment.baseHref || ''}assets/dojo/dojo.js`,
    `${environment.baseHref || ''}assets/jsdraw/Scilligence.JSDraw2.Pro.js`,
    `${environment.baseHref || ''}assets/jsdraw/Scilligence.JSDraw2.Resources.js`,
    `${environment.baseHref || ''}assets/jsdraw/JSDraw.extensions.js`

  ];
  private ketcherUrls = [
    `${environment.baseHref || ''}assets/ketcher/static/js/main.963f80c2.js`,
    `${environment.baseHref || ''}assets/ketcher/static/js/583.7fb8b79c.chunk.js`,
  ];
  firstload = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private structureService: StructureService,
    private loadingService: LoadingService,
    private configService: ConfigService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
  ) { }

  ngOnDestroy(): void {
    window.removeEventListener('drop', this.preventDrag);
    window.removeEventListener('dragover', this.preventDrag);
    window.removeEventListener('paste', this.checkPaste);
    (<HTMLCanvasElement>this.myCanvas.nativeElement).removeEventListener('click', this.listener);
    delete this.ketcher;
    let parentElement = document.getElementById('ketcherwrapper');
    let childElement = document.getElementById('root');
    delete window['ketcher'];
    // Check if both elements exist
    if (parentElement && childElement) {
        // Remove the child element from the parent element
        parentElement.removeChild(childElement);

    } else {
    }

  }

  ngAfterViewInit(): void {
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
    this.canvasCopy = <HTMLCanvasElement>this.myCanvas.nativeElement;
    const test = (<HTMLCanvasElement>this.myCanvas.nativeElement);
    if (test) {
     // test.addEventListener('click', this.click);
    }
  }

  @Input() setMolecule(structure: any){
    if(this.structureEditor==="ketcher") {
      this.structureService.interpretStructure(structure).subscribe(resp => {
        this.ketcher.setMolecule(resp.structure.molfile);
      });
    } else {
      this.editor.setMolecule(structure);
    }
  } 

  listener = ()  => {
    var elmR=document.getElementById("root");
    if(this.structureEditor==="ketcher"){
      if( elmR && elmR.querySelector(":focus-within")){
        this.getSketcher().activated=true;
      }else{
        this.getSketcher().activated=false;
      }
    }
  }

  private preventDrag = (event: DragEvent) => {
   // console.log('prevent drag');
    event.preventDefault();
  }

// override JSDraw for Molvec paste event. Using the JSDraw menu copy function seems to ignore this at first
  checkPaste = (event: ClipboardEvent ) => {
    if ((this.jsdraw || this.ketcher )&& this.getSketcher().activated) {
     event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
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
   // window.addEventListener('keyup',this.listener);
  window.addEventListener('click',this.listener);
    this.overlayContainer = this.overlayContainerService.getContainerElement();

    
    if (isPlatformBrowser(this.platformId)) {

      

      window.addEventListener('dragover', this.preventDrag);
      window.addEventListener('drop', this.preventDrag);
      window.addEventListener('paste', this.checkPaste);


      this.structureEditor = environment.structureEditor;
      let pref = sessionStorage.getItem('gsrsStructureEditor');
      if (pref && this.enableJSDraw) {
        if (pref === 'ketcher') {
          this.structureEditor = 'ketcher';
        } else if (pref === 'jsdraw') {
          this.structureEditor = 'jsdraw';
        }
      }

      if (this.configService && this.configService.configData && this.configService.configData.jsdrawLicense ) {
        this.enableJSDraw = this.configService.configData.jsdrawLicense;
        if (!this.enableJSDraw) {
          this.structureEditor = 'ketcher';
        }
      } else if (this.configService && this.configService.configData && this.configService.configData.disableKetcher ) {
        this.enableKetcher = !this.configService.configData.disableKetcher;

        if (!this.enableKetcher) {
          this.structureEditor = 'jsdraw';
        }
      }

      this.editorSwitched.emit(this.structureEditor);

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
  
        
        for (let i = 0; i < this.ketcherUrls.length; i++) {
          const node = document.createElement('script');
          node.src = this.ketcherUrls[i];
          node.type = 'text/javascript';
          node.async = false;
          document.getElementsByTagName('head')[0].appendChild(node);
        }

        const node = document.createElement('link');
        node.href = `${environment.baseHref || ''}assets/ketcherOld/ketcher.css`;
        node.rel="stylesheet";
     //   document.getElementsByTagName('head')[0].appendChild(node);

        const node2 = document.createElement('link');
        node2.href = `${environment.baseHref || ''}assets/ketcher/static/css/main.3fc9c0f8.css`;
        node2.rel="stylesheet";
        document.getElementsByTagName('head')[0].appendChild(node2);
    }
  }

  ketcherOnLoad(ketcher: any): void {
      // this.ketcher = ketcher;
      // this.ketcherLoaded = true;
  }

  getSketcher(){
    var skt;
    for(var k in window['JSDraw2'].Editor._allitems){
     skt= window['JSDraw2'].Editor._allitems[k];
    }

    return skt;
 }


  toggleEditor() {
    if (this.structureEditor === 'ketcher' ) {
      this.getSketcher().activated=true;
      this.editor.getMolfile().pipe(take(1)).subscribe(Response => {
        this.structureEditor = 'jsdraw';
      //  this.editor = new EditorImplementation(this.ketcher, this.jsdraw, 'jsdraw');
      this.editor = new EditorImplementation(null, this.jsdraw);

        this.structureService.interpretStructure(Response).subscribe(resp => {
          this.editorOnLoad.emit(this.editor);
          this.editorSwitched.emit(this.structureEditor);
          this.jsdraw.setMolfile(resp.structure.molfile);

        sessionStorage.setItem('gsrsStructureEditor', 'jsdraw');
      document.getElementById("root").style.display="none";
        });
       });
    } else {
      this.getSketcher().activated=false;

      sessionStorage.setItem('gsrsStructureEditor', 'ketcher');
     if(!this.ketcherLoaded) {
      this.ketcher = window['ketcher'];
      this.ketcherLoaded = true;
      
     }

     this.editor.getMolfile().pipe(take(1)).subscribe(Response => {
      this.structureEditor = 'ketcher';
     // this.editor = new EditorImplementation(this.ketcher, this.jsdraw, 'ketcher');
      this.editor = new EditorImplementation(this.ketcher);
      this.structureService.interpretStructure(Response).subscribe(resp => {
        this.editorOnLoad.emit(this.editor);
       this.editorSwitched.emit(this.structureEditor);
       this.ketcher.setMolecule(resp.structure.molfile);

      });
      sessionStorage.setItem('gsrsStructureEditor', 'ketcher');
    document.getElementById("root").style.display="none";
    });

      this.structureEditor = 'ketcher';
       document.getElementById("root").style.display="";
    }
  }

  jsDrawOnLoad(jsdraw: JSDraw): void {
    this.jsdraw = jsdraw;
    this.jsdrawLoaded = true;
    //  this.editor = new EditorImplementation(this.ketcher, this.jsdraw, 'jsdraw');
    this.editor = new EditorImplementation(null, this.jsdraw);
      this.editorOnLoad.emit(this.editor);
      this.editorSwitched.emit(this.structureEditor);

      if (this.firstload && this.structureEditor === 'ketcher' ) {
        document.getElementById("root").style.display="";
          this.waitForKetcherFirstLoad();
          this.firstload = false;

      } else if (this.firstload) {
        this.firstload = false;
      }
    
  }

  async waitForKetcherFirstLoad(): Promise<void> {
    await this.executeOnceNotNullOrUndefined(() => window['ketcher'], (obj) => {
    setTimeout(() => {
      this.ketcher = window['ketcher'];
      this.ketcherLoaded = true;
      document.getElementById("root").style.display="";
     // this.editor = new EditorImplementation(this.ketcher, this.jsdraw, 'ketcher');
     this.editor = new EditorImplementation(this.ketcher);
      this.editorOnLoad.emit(this.editor);
      this.editorSwitched.emit(this.structureEditor);

    /*  this.ketcher.editor.subscribe('change',  operations => { 
        this.ketcher.getMolfile().then(result => {
          this.getSketcher().setFile(result, "mol");	
        })
        if(!(operations.length == 1 && operations[0].operation == 'Load canvas')){
        }
        
        
     });*/

     this.ketcher.editor.event.change.handlers.push({f:(c)=>{
      this.ketcher.getMolfile().then(result => {
        let mfile = [null];
       mfile[0]= result;
        this.getSketcher().setFile(mfile[0], "mol");	
      })
      }	
      });

    }, 150);
    
  });
}

  executeOnceNotNullOrUndefined<T>(objProvider: () => T | null | undefined, callback: (obj: T) => void, interval: number = 100): void {
    const intervalId = setInterval(() => {
        const obj = objProvider();
        if (obj !== null && obj !== undefined) {
            clearInterval(intervalId);
            callback(obj);
        }else {
        }
    }, interval);
}



  waitForNonNull(variable: () => any): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (variable() && variable() !== null) {
          clearInterval(interval);
          resolve();
        }
      }, 100); 
    });
  }

  get _jsdrawScriptUrls(): Array<string> {
    return this.jsdrawScriptUrls;
  }

  onDropHandler(object: any): void {
    //rule out tiny icons / images accidentally being dragged from jsdraw UI
    if(object.backup.size < 700) {
      this.canvasMessage = 'The selected file is too small to be read (<700 bytes)';
    }
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
      if (this.ketcher && this.structureEditor === 'ketcher') {
        this.ketcher.setMolecule(mol);
          setTimeout(() => {
            this.editor.setMolecule(mol);
          }, 100);
          this.loadedMolfile.emit(mol);

          this.loadingService.setLoading(false);
          this.structureService.molvec(img).subscribe(resp => {
            setTimeout(() => {
              this.editor.setMolecule(resp.molfile);
              this.ketcher.setMolecule(mol);
            }, 100);
          }, error => {
            this.canvasMessage = 'Structure not detectable';
            this.loadingService.setLoading(false);
          });

      }
      else {
        this.jsdraw.setMolfile(mol);
        this.loadingService.setLoading(false);
        this.loadedMolfile.emit(mol);

      }
      
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
        this.canvasMessage = '';
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
          this.canvasMessage = '';
          this.loadingService.setLoading(true);
          this.structureService.interpretStructure(text).subscribe(response => {
            
            if (response.structure && response.structure.molfile) {
             
                this.editor.setMolecule(response.structure.molfile);
              
              this.loadedMolfile.emit(response.structure.molfile);

              if(response.structure.smiles === '') {
                this.canvasMessage = 'empty or invalid structure pasted';
              }
            } else {
              this.canvasMessage = 'Structure text not recognized';
            }
            this.loadingService.setLoading(false);

          },error =>{
            this.loadingService.setLoading(false);
            this.canvasMessage = 'empty or invalid structure pasted';
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


openMolvecImportDialog(): void {
  const dialogRef = this.dialog.open(MolvecModalComponent, {
    height: 'auto',
    width: '650px',
    data: {}
  });
  this.overlayContainer.style.zIndex = '1002';

  dialogRef.afterClosed().subscribe((response?: any) => {
    this.overlayContainer.style.zIndex = null;
    if (response != null) {
      if (response.type = "img") {
        this.createImage(response.file);
      }
      if (response.type = "text") {
        this.structureService.interpretStructure(response.file).subscribe(response => {
          if (response.structure && response.structure.molfile) {
            this.ketcher.setMolecule(response.structure.molfile);
            this.loadedMolfile.emit(response.structure.molfile);
          }
        });
      }
    }
  }, () => { });
}

}
