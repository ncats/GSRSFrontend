import { Directive, Output, HostListener, EventEmitter, Input , OnInit } from '@angular/core';

@Directive({
  selector: '[appDragDropPaste]',
})
export class DragDropPasteDirective {

  @Output() dropHandler: EventEmitter<any> = new EventEmitter<any>();

  public dragging: boolean;
  public loaded: boolean;
  public imageSrc: string;
  public invalidFlag: boolean;
  public file: any;


  @HostListener('dragover') onDragOver() {
    return false;
  }
  @HostListener('dragenter') handleDragEnter() {
    this.dragging = true;
  }
  @HostListener('dragleave') handleDragLeave() {
    this.dragging = false;
  }
  @HostListener('drop', ['$event']) handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }

  OnInit() {
  }

  handlePaste(e): void {
    const items = e.clipboardData.items;
    this.invalidFlag = true;
    for (let i = 0; i < items.length; i++) {
      const blob = items[i].getAsFile();
      if (items[i].type.indexOf('image') !== -1) {
        const reader = new FileReader();
        this.invalidFlag = false;
        this.file = blob;
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsDataURL(blob);
      }
    }
    if (this.invalidFlag === true) {
      this.dropHandler.emit({ event: e, invalidFlag: this.invalidFlag });
    }
  }

  handleInputChange(e): void {
    const file = e.dataTransfer ? e.dataTransfer.files[0] : 'null';
    this.invalidFlag = false;
    const pattern = /image-*/;
    const reader = new FileReader();
    if (!file.type.match(pattern)) {
      this.invalidFlag = true;
      return this.dropHandler.emit({ event: e, invalidFlag: this.invalidFlag });
    }
    this.loaded = false;
    this.file = file;
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  handleReaderLoaded(e): void {
    const reader = e.target;
    this.imageSrc = reader.result;
    this.loaded = true;
    this.dropHandler.emit({ event: e, backup: this.file, invalidFlag: this.invalidFlag });
  }

}
