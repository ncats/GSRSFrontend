import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@Component({
  selector: 'app-json-fda-dialog',
  templateUrl: './json-dialog-fda.component.html',
  styleUrls: ['./json-dialog-fda.component.scss']
})
export class JsonDialogFdaComponent implements OnInit {

  // @Input() json: any;

  public dialogRef: MatDialogRef<JsonDialogFdaComponent>;
  public json: any;
  jsonFilename: null;

  expand = true;
  raw = false;
  downloadJsonHref: any;

  constructor(
    private sanitizer: DomSanitizer,
 //   private dialogRef: MatDialogRef<JsonDialogFdaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {
    // if json data exists
    if (this.data.jsonData) {
    this.json = this.data.jsonData;
    }

    // if filename exists, save the json in this filename
    if (this.data.jsonFilename) {
      this.jsonFilename = this.data.jsonFilename;
    }

    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(this.json)));
    this.downloadJsonHref = uri;
  }

  close() {
    this.dialogRef.close();
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }

}
