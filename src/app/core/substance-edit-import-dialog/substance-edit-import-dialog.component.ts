import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
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

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<SubstanceEditImportDialogComponent>

  ) { }

  ngOnInit() {
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
          if (!read['substanceClass']) {
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
    }
  }

  useFile() {
    this.dialogRef.close(this.record);
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
