import {Component, Inject, OnInit} from '@angular/core';
import {ApplicationService} from '../../service/application.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-json-fda-dialog',
  templateUrl: './json-dialog-fda.component.html',
  styleUrls: ['./json-dialog-fda.component.scss']
})
export class JsonDialogFdaComponent implements OnInit {
  public dialogRef: MatDialogRef<JsonDialogFdaComponent>;
  public json: any;
  expand = true;
  raw = false;
  downloadJsonHref: any;

  constructor(
    private applicationService: ApplicationService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {
    this.json = this.applicationService.getJson();
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(this.json)));
    this.downloadJsonHref = uri;
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }

}
