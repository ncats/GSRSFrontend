import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';
import { SubstanceService } from '../../substance/substance.service';

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
    private substanceService: SubstanceService
  ) { }

  ngOnInit() {
  }

  importStructure(): void {
    this.message = null;
    if (this.importTextControl.value) {
      this.isLoading = true;
      this.substanceService.postSubstanceStructure(this.importTextControl.value).subscribe(response => {
        this.isLoading = false;
        if (response && response.structure && response.structure.molfile) {
          this.dialogRef.close(response.structure.molfile);
        } else {
          this.messageClass = 'error';
          this.message = 'You need to enter a valid molfile or smiles';
        }

      }, error => {
        this.isLoading = false;
        this.messageClass = 'error';
        this.message = 'There was an error importing your structure. Please refresh and try again.';
      });
    } else {
      this.messageClass = 'error';
      this.message = 'You have not entered anything to import';
    }
  }

  fileSelected(file: File): void {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.importTextControl.setValue(fileReader.result);
      };
      fileReader.readAsText(file);
    }
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }

}
