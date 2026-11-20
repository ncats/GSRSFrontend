import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-substance-edit-import-dialog',
    templateUrl: './substance-edit-import-dialog.component.html',
    styleUrls: ['./substance-edit-import-dialog.component.scss'],
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatDividerModule, MatTabsModule, FormsModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor(
    private router: Router,
    private configService: ConfigService,
    public dialogRef: MatDialogRef<SubstanceEditImportDialogComponent>,
    private substanceService: SubstanceService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const incoming =this.configService.configData.isPfdaVersion;
    if( typeof incoming === 'boolean') {
      this.urlImportEnabled = incoming;
    }
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
            this.checkIds(read);
          }
        } else {
          this.message = 'Error: Invalid file format';
          this.loaded = false;
        }
        this.cdr.markForCheck();
      };
      reader.readAsText(event.target.files[0]);
    }
  }

  importSubstance() {
    const checkbox = document.getElementById('replaceIdsCheckbox') as HTMLInputElement;
    const replaceIds = checkbox != null && checkbox.checked;
    if (this.currentTab === 0) {
      if (replaceIds) {
        this.resetIds(JSON.parse(this.record));
      } else {
        this.message = '';
        this.dialogRef.close(this.record);
      }
    } else if (this.currentTab === 1) {
      const read = JSON.parse(this.pastedJSON);
      if (!read['substanceClass']) {
        this.message = 'Error: Invalid JSON format';
        this.loaded = false;
      } else {
        this.loaded = true;
        if (replaceIds) {
          this.resetIds(read);
        } else {
          this.record = this.pastedJSON;
          this.message = '';
          this.dialogRef.close(this.record);
        }
      }
    } else if (this.currentTab === 2) {
      fetch(`/reverse-proxy?url=${this.pastedUrl}`).then(r => {
        if (r.status !== 200) {
          r.json().then(data => {
            this.message = data.message ? data.message : 'Error while loading given URL';
            this.cdr.markForCheck();
          }).catch(_e => {
            this.message = 'Error while loading given URL';
            this.cdr.markForCheck();
          })
        } else {
          const json = r.text().then(data => {
            try {
              const read = JSON.parse(data);
              if (replaceIds) {
                this.resetIds(read);
              } else {
                this.record = data;
                this.dialogRef.close(this.record);
              }
            } catch (_e) {
              this.message = 'Error: The URL does not point to a valid JSON file'
              this.cdr.markForCheck();
            }
          });
        }
      }).catch(e => {
        this.message = `Error: ${e.message}`;
        this.cdr.markForCheck();
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

  checkIds(subst: any) {
    this.substanceService.checkSubstanceForDuplicateIds(subst).subscribe(results => {
      
      console.log(`result of checkSubstanceForDuplicateIds: ${results}`);

      const div = document.getElementById('replaceIdsDiv');
      if (div !== null) {
        const hasDuplicates = results != null && results.toString() === 'true';
        div.style.visibility = hasDuplicates ? 'visible' : 'hidden';
        const checkbox = document.getElementById('replaceIdsCheckbox') as HTMLInputElement;
        if (checkbox !== null) {
          checkbox.checked = false;
        }
      }
    }, error => {
      console.log(`error checking UUIDs: ${error}`);
    });
  }

  resetIds(subst: any) {
    this.loaded = false;
    this.message = '';
    this.substanceService.resetSubstanceIds(subst).subscribe(results => {
      // The form consuming the dialog result expects serialized JSON.
      this.record = typeof results === 'string' ? results : JSON.stringify(results);
      this.dialogRef.close(this.record);
    }, error => {
      this.loaded = true;
      this.message = 'Error resetting UUIDs. Please try again.';
      console.log(`error reseting UUIDs: ${error}`);
    });
  }
}
