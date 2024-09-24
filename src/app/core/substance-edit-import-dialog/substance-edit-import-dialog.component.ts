import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTabChangeEvent } from "@angular/material/tabs";
import { ConfigService } from "@gsrs-core/config";

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
  title = 'Substance Import';
  entity = 'Substance';

  currentTab: number = 0;
  urlImportEnabled: boolean = false;
  apiBaseUrl: string = '';

  constructor(
    private router: Router,
    private configService: ConfigService,
    public dialogRef: MatDialogRef<SubstanceEditImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.urlImportEnabled = this.configService.configData.customToolbarComponent === 'precisionFDA';
    this.apiBaseUrl = this.configService.configData.apiBaseUrl;
  }

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
    }
  }

  importSubstance() {
    if (this.currentTab === 0) {
      // Nothing
      this.dialogRef.close(this.record);
    } else if (this.currentTab === 1) {
      const read = JSON.parse(this.pastedJSON);
      if (!read['substanceClass']) {
        this.message = 'Error: Invalid JSON format';
        this.loaded = false;
      } else {
        this.loaded = true;
        this.record = this.pastedJSON;
        this.message = '';
        this.dialogRef.close(this.record);
      }
    } else if (this.currentTab === 2) {
      fetch(`${this.apiBaseUrl}beta/reverse-proxy?url=${this.pastedUrl}`).then(r => {
        if (r.status !== 200) {
          r.json().then(data => {
            this.message = data.message ? data.message : 'Error while loading given URL';
          }).catch(_e => {
            this.message = 'Error while loading given URL';
          })

        } else {
          const json = r.text().then(data => {
            try {
              JSON.parse(data);
              this.record = data;
              this.dialogRef.close(this.record);
            } catch (_e) {
              this.message = 'Error: The URL does not point to a valid JSON file'
            }
          });
        }
      }).catch(e => {
        this.message = `Error: ${e.message}`;
      })
    }
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

  checkUrl() {
    try {
      new URL(this.pastedUrl);
      this.loaded = true;
      this.message = '';
    } catch (_e) {
      this.message = 'Invalid URL';
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

  tabChanged(tabChangeEvent: MatTabChangeEvent) {
    if (this.currentTab !== tabChangeEvent.index) {
      this.currentTab = tabChangeEvent.index;
      this.message = '';
      this.loaded = false;
      this.record = '';
      this.pastedJSON = '';
      this.pastedUrl = '';
      this.filename = '';
    }
  }

}
