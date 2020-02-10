import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { StructureService } from '../structure.service';

@Component({
  selector: 'app-structure-import',
  templateUrl: './structure-import.component.html',
  styleUrls: ['./structure-import.component.scss']
})
export class StructureImportComponent implements OnInit {
  isLoading = false;
  importTextControl = new FormControl();
  messageClass = 'error';
  message: string;

  constructor(
    public dialogRef: MatDialogRef<StructureImportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gaService: GoogleAnalyticsService,
    private structureService: StructureService
  ) { }

  ngOnInit() {
  }

  importStructure(): void {
    this.message = null;
    if (this.importTextControl.value) {
      this.isLoading = true;
      this.structureService.postStructure(this.importTextControl.value).subscribe(response => {
        this.isLoading = false;
        if (response && response.structure && response.structure.molfile) {
          this.gaService.sendEvent('structureImport', 'button:import', 'file imported');
          this.dialogRef.close(response);
        } else {
          this.messageClass = 'error';
          this.message = 'You need to enter a valid molfile or smiles';
          this.gaService.sendException('wrong structure data imported');
        }

      }, error => {
        this.isLoading = false;
        this.messageClass = 'error';
        this.message = 'There was an error importing your structure. Please refresh and try again.';
        this.gaService.sendException('postSubstanceStructure error');
      });
    } else {
      this.messageClass = 'error';
      this.message = 'You have not entered anything to import';
      this.gaService.sendException('no structure data entered for import');
    }
  }

  fileBrowse() {
    this.gaService.sendEvent('structureImport', 'button:browse-file', 'browse file');
  }

  fileSelected(file: File): void {
    this.gaService.sendEvent('structureImport', 'file-selected', 'file selected');
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.importTextControl.setValue(fileReader.result);
      };
      fileReader.readAsText(file);
    }
  }

  dismissDialog(): void {
    this.gaService.sendEvent('structureImport', 'button:close', 'no file imported');
    this.dialogRef.close();
  }



}
