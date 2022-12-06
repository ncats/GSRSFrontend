import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-structure-export',
  templateUrl: './structure-export.component.html',
  styleUrls: ['./structure-export.component.scss']
})
export class StructureExportComponent implements OnInit {
  anchorElement: HTMLAnchorElement;
  selectedIndex = 0;
  private downloadFunctions = [
    function downloadMol(
      data: { molfile: string, smiles: string},
      anchorElement: HTMLAnchorElement,
      downloadFile: any): void {
      if (data.molfile != null) {
        const file = new Blob([data.molfile], { type: 'chemical/x-mdl-molfile' });
        anchorElement.download = 'substance_structure.mol';
        downloadFile(file, anchorElement);
      }
    },
    function downloadSmiles(
      data: { molfile: string, smiles: string },
      anchorElement: HTMLAnchorElement,
      downloadFile: any): void {
      if (data.smiles != null) {
        const file = new Blob([data.smiles], { type: 'text/plain' });
        anchorElement.download = 'substance_smiles.smi';
        downloadFile(file, anchorElement);
      }
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<StructureExportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { molfile: string, smiles: string,  type: string  }
  ) {
    this.anchorElement = document.createElement('a') as HTMLAnchorElement;
  }

  ngOnInit() {
  }

  selectedIndexChange(index: number): void {
    this.selectedIndex = index;
  }

  download(): void {
    this.downloadFunctions[this.selectedIndex](this.data, this.anchorElement, this.downloadFile);
  }

  private downloadFile(file: Blob, anchorElement: HTMLAnchorElement): void {
    anchorElement.href = window.URL.createObjectURL(file);
    anchorElement.click();
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }
}
