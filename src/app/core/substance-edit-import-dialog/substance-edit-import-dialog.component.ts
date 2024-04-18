import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ConfigService } from '@gsrs-core/config';

@Component({
  selector: 'app-substance-edit-import-dialog',
  templateUrl: './substance-edit-import-dialog.component.html',
  styleUrls: ['./substance-edit-import-dialog.component.scss']
})
export class SubstanceEditImportDialogComponent implements OnInit {
  public json: any;
  message = '';
  loaded = false;
  record: any;
  filename: string;
  pastedJSON: string;
  pastedUrl: string;
  uploaded = false;
  customToolbarComponent: string;
  title = 'Substance Import';
  entity = 'Substance';

  constructor(
    private router: Router,
    private configService: ConfigService,
    public dialogRef: MatDialogRef<SubstanceEditImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.customToolbarComponent = this.configService.configData.customToolbarComponent;
  }

  ngOnInit() {
    if (this.data) {
      if (this.data.title) {
        this.title = this.data.title;
        this.entity = this.data.entity;
      }
    }
  }

  onTabChanged(event: MatTabChangeEvent): void {
    this.loaded = false;
    this.message = '';
    this.pastedJSON = '';
    this.filename = null;
    this.record = null;
    this.pastedUrl = '';
  }

  uploadFile(event) {
    if (event.target.files.length !== 1) {
      this.message = 'No file selected';
          this.loaded = false;
    } else {
      const file = event.target.files[0];
      this.filename = file.name;
      const reader = new FileReader();
      reader.onloadend = (e) => {
        const response = reader.result.toString();
        if (this.jsonValid(response)) {
          const read = JSON.parse(response);
          if (!read['substanceClass'] && this.entity === 'Substance') {
            this.message = 'Error: Invalid JSON format';
            this.loaded = false;
          } else {
            this.loaded = true;
            this.record = response;
            this.message = '';
          }
        } else {
          this.message = 'Error: Invalid file format';
          this.loaded = false;
        }
      };
      reader.readAsText(event.target.files[0]);
      this.uploaded = true;
    }
  }

  importJson() {
    if (this.uploaded) {
      this.dialogRef.close(this.record);

    } else if (this.pastedJSON) {
      const read = JSON.parse(this.pastedJSON);
      if (!read['substanceClass']) {
        this.message = 'Error: Invalid JSON format';
        this.loaded = false;
      } else {
        this.loaded = true;
        this.record = this.pastedJSON;
        this.message = '';
      }
      this.dialogRef.close(this.record);

    } else if (this.pastedUrl) {
      // Due to CORS policies, the file has to be loaded through reverse proxy provided by server (if available)
      const baseHref = this.configService.environment.baseHref || '/';
      fetch(baseHref + 'reverse-proxy?url=' + encodeURIComponent(this.pastedUrl)).then((response) => {
        if (response.status === 200) {
          response.text().then((body) => {
            this.record = body;
            this.dialogRef.close(this.record);
          });
        } else {
          response.json().then((body) => {
            this.message = body.message;
          });
        }
      });
    }
  }

  validatePastedJson() {
    this.loaded = true;
    try {
      JSON.parse(this.pastedJSON);
      this.message = '';
    } catch (e) {
      this.message = 'Error: Invalid JSON format in pasted string';
      this.loaded = false;
    }
  }

  validatePastedUrl() {
    this.loaded = true;
    try {
      new URL(this.pastedUrl);
      this.message = '';
    } catch (e) {
      this.message = 'Error: Invalid URL format in pasted string';
      this.loaded = false;
    }
  }

  openInput(): void {
    document.getElementById('fileInput').click();
  }

  jsonValid(file: any): boolean {
    try {
      JSON.parse(file);
    } catch (e) {
      return false;
    }
    return true;
  }

}
