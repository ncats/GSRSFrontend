import {Component, Inject, OnInit} from '@angular/core';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-json-dialog',
  templateUrl: './json-dialog.component.html',
  styleUrls: ['./json-dialog.component.scss']
})
export class JsonDialogComponent implements OnInit {
  public dialogRef: MatDialogRef<JsonDialogComponent>;
  public json: any;
  expand = true;
  raw = false;
  downloadJsonHref: any;

  constructor(
    private substanceFormService: SubstanceFormService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {
    this.json = this.substanceFormService.getJson();
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(this.json)));
    this.downloadJsonHref = uri;
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }

}
