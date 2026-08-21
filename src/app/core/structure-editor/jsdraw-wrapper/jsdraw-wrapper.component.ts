import {
  Component,
  AfterViewInit,
  Output,
  EventEmitter,
  PLATFORM_ID,
  Inject,
  ElementRef,
  DestroyRef,
  HostListener,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import type { JSDraw } from "@gsrs-core/structure-editor";

@Component({
  selector: "ncats-jsdraw-wrapper",
  template: `<div [id]="randomId" dataformat="molfile"></div>`,
  styles: [":host { display: block; } :host([hidden]) { display: none; }"],
  standalone: false,
})
export class JsdrawWrapperComponent implements AfterViewInit {
  randomId: string;
  private jsdraw: JSDraw;
  @Output() jsDrawOnLoad = new EventEmitter<JSDraw>();
  private resizeFrame?: number;
  private resizeObserver?: ResizeObserver;
  private loadAttempts = 0;
  private lastDrawingWidth = 0;
  private lastHeight = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private el: ElementRef<HTMLElement>,
    private destroyRef: DestroyRef
  ) {
    this.randomId = Math.random().toString(36).replace("0.", "");
    this.destroyRef.onDestroy(() => {
      if (this.resizeFrame != null && isPlatformBrowser(this.platformId)) {
        window.cancelAnimationFrame(this.resizeFrame);
      }
      this.resizeObserver?.disconnect();
    });
  }

  ngAfterViewInit() {
    this.loadEditor();

    if (isPlatformBrowser(this.platformId)) {
      if ("ResizeObserver" in window) {
        this.resizeObserver = new ResizeObserver(() => this.scheduleResize());
        this.resizeObserver.observe(this.el.nativeElement);
      }
    }
  }

  @HostListener("window:resize")
  onWindowResize(): void {
    if (!this.resizeObserver) {
      this.scheduleResize();
    }
  }

  private scheduleResize(): void {
    if (!isPlatformBrowser(this.platformId)) {
 return; 
}
    if (this.resizeFrame != null) {
 return; 
}

    this.resizeFrame = window.requestAnimationFrame(() => {
      this.resizeFrame = undefined;
      this.doResize();
    });
  }

  loadEditor(): void {
    if (isPlatformBrowser(this.platformId)) {
      const win = window as any;
      //this will ensure that the extra resources file has been loaded before the full editor is
      if (
        win["JSDraw"] &&
        win["dojo"] &&
        win["scil"] &&
        win["scil"].Utils &&
        win["scil"].Utils._loadedAdditions
      ) {
        win["dojo"].ready(() => {
          this.jsdraw = new win["JSDraw"](this.randomId);
          this.jsDrawOnLoad.emit(this.jsdraw);
          this.scheduleResize();
          //customization of buttons
          if (win["afterSketcherMade"]) {
            win["afterSketcherMade"]();
          }
        });
      } else if (this.loadAttempts < 5000) {
        this.loadAttempts++;
        setTimeout(() => {
          this.loadEditor();
        }, 10);
      }
    }
  }

  private doResize(): void {
    const editor = this.jsdraw as any;
    // Skip if not initialised, hidden (display:none), or resize API absent
    if (!editor || !this.el.nativeElement.offsetParent || typeof editor.resize !== "function") {
 return; 
}

    const availableWidth = Math.floor(this.el.nativeElement.getBoundingClientRect().width);
    if (availableWidth <= 0) {
 return; 
}

    const svg = this.el.nativeElement.querySelector("svg") as SVGSVGElement | null;
    const height = this.getSvgDimension(svg, "height");
    if (height <= 0) {
 return; 
}

    const editorRoot = this.el.nativeElement.firstElementChild as HTMLElement | null;
    const svgWidth = this.getSvgDimension(svg, "width");
    const editorWidth = Math.floor(editorRoot?.getBoundingClientRect().width ?? 0) || availableWidth;
    const chromeWidth = svgWidth > 0 ? Math.max(0, editorWidth - svgWidth) : 0;
    const drawingWidth = Math.max(1, availableWidth - chromeWidth);
    if (drawingWidth === this.lastDrawingWidth && height === this.lastHeight) {
 return; 
}

    editor.resize(drawingWidth, height);
    this.lastDrawingWidth = drawingWidth;
    this.lastHeight = height;
  }

  private getSvgDimension(svg: SVGSVGElement | null, dimension: "width" | "height"): number {
    if (!svg) {
 return 0; 
}

    const baseValue = svg[dimension]?.baseVal?.value;
    if (baseValue > 0) {
 return baseValue; 
}

    const attributeValue = parseInt(svg.getAttribute(dimension) ?? "0", 10);
    if (attributeValue > 0) {
 return attributeValue; 
}

    return Math.floor(svg.getBoundingClientRect()[dimension]);
  }
}
