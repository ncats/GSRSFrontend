import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
  uploaded = false;
  title = 'Substance Import';
  entity = 'Substance';

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<SubstanceEditImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data) {
      if (this.data.title) {
        this.title = this.data.title;
        this.entity = this.data.entity;
      }
    }
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

  useFile() {
    if (!this.uploaded && this.pastedJSON) {
        const read = JSON.parse(this.pastedJSON);
        if (!read['substanceClass']) {
          this.message = 'Error: Invalid JSON format';
          this.loaded = false;
        } else {
          this.loaded = true;
          this.record = this.pastedJSON;
          this.message = '';
        }
    }
    this.dialogRef.close(this.record);
  }


  checkLoaded() {
    this.loaded = true;
    try {
      JSON.parse(this.pastedJSON);
      this.message = '';
  } catch (e) {
    this.message = 'Error: Invalid JSON format in pasted string';
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
