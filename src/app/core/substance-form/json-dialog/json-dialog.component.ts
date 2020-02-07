import { Component, OnInit } from '@angular/core';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {MatDialogRef} from '@angular/material/dialog';
import {AmountFormDialogComponent} from '@gsrs-core/substance-form/amount-form-dialog/amount-form-dialog.component';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-json-dialog',
  templateUrl: './json-dialog.component.html',
  styleUrls: ['./json-dialog.component.scss']
})
export class JsonDialogComponent implements OnInit {
  public dialogRef: MatDialogRef<AmountFormDialogComponent>;
  public json: any;
  expand = true;
  raw = false;
  downloadJsonHref: any;

  constructor(
    private substanceFormService: SubstanceFormService,
    private sanitizer: DomSanitizer

  ) { }

  ngOnInit() {
    this.json = this.substanceFormService.getJson();
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(this.json));
    this.downloadJsonHref = uri;
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }

}
