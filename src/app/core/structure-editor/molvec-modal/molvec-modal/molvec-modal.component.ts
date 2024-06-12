import { Component, HostListener, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, } from '@angular/material/dialog';

@Component({
  selector: 'app-molvec-modal',
  templateUrl: './molvec-modal.component.html',
  styleUrls: ['./molvec-modal.component.scss']
})
export class MolvecModalComponent implements OnInit {

  tempClass = "";
  sent = {};
  invalidFlag = false;
  message: string;

  constructor(   
    public dialogRef: MatDialogRef<MolvecModalComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any
) { }

  ngOnInit(): void {
    window.addEventListener('dragover', this.preventDrag);
      window.addEventListener('drop', this.preventDrag);
     window.addEventListener('paste', this.checkPaste);
  }

  @HostListener('paste', ['$event']) private paster(event: any) {
    // console.log('host paste');
     event.preventDefault();
     event.stopPropagation();
     event.stopImmediatePropagation();
     this.catchPaste(event);
   }
 
   @HostListener('drop', ['$event']) private dropper(event: any) {
     console.log('drop');
     console.log(event);
    // this.onDropHandler(event);
     event.preventDefault();
     event.stopPropagation();
     event.stopImmediatePropagation();
     this.handleInputChange(event);
   }
 
   @HostListener('dragover', ['$event']) private dragger(event: DragEvent) {
     console.log('drag');
     event.preventDefault();
     event.stopPropagation();
     event.stopImmediatePropagation();
   }

   private preventDrag = (event: DragEvent) => {
     console.log('prevent drag');
     event.preventDefault();
   }
 
   checkPaste = (event: ClipboardEvent ) => {
      this.message = null;
       this.catchPaste(event);
     }

     handleInputChange(e): void {
      this.message = null;

      const file = e.dataTransfer ? e.dataTransfer.files[0] : 'null';
      this.invalidFlag = false;
      const pattern = /image-*/;
      const reader = new FileReader();
      if (!file.type.match(pattern)) {
        this.invalidFlag = true;
      }
      reader.readAsDataURL(file);
        const that = this;
        reader.onloadend = () => {
          setTimeout(() => {
            const img = reader.result.toString();
           // that.createImage(img);
           this.sent = {
            "file":img,
            "type": "img"
           }
           this.dialogRef.close(this.sent);

          });
        }
    }

   catchPaste(event: ClipboardEvent): void {
    this.message = null;

    console.log('paste intercept');
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
           // that.createImage(img);
           this.sent = {
            "file":img,
            "type": "img"
           }
           this.dialogRef.close(this.sent);

          });
        };
      } else if (items[i].type === 'text/plain') {
        const text = event.clipboardData.getData('text/plain');
        if (text.indexOf('<div') === -1) {
          event.preventDefault();
          event.stopPropagation();
          this.sent = {
            "file":text,
            "type": "text"
           }
           this.dialogRef.close(this.sent);
        /*  this.structureService.interpretStructure(text).subscribe(response => {
            if (response.structure && response.structure.molfile) {
              this.loadedMolfile.emit(response.structure.molfile);
            }
          });*/
        }
      }
    }


  }

  onDropHandler(object: any): void {
    console.log('drop handler');
    if (object.invalidFlag) {
     this.message = 'The selected file could not be read';
    } else {
      const img = object.event.target.result;
      this.sent = {
        "file":img,
        "type": "img"
       }
       this.dialogRef.close(this.sent);
      
    }
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }

}
