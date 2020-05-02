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
  expand = true;
  raw = false;
  downloadJsonHref: any;

  constructor(
    private sanitizer: DomSanitizer,
 //   private dialogRef: MatDialogRef<JsonDialogFdaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {
    this.json = this.data;
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(this.json)));
    this.downloadJsonHref = uri;
  }

  close() {
    alert('AAAAAAa');
    this.dialogRef.close();
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }

}
