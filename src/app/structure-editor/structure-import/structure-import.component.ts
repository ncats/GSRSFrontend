import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-structure-import',
  templateUrl: './structure-import.component.html',
  styleUrls: ['./structure-import.component.scss']
})
export class StructureImportComponent implements OnInit {
  isLoading = false;
  importTextControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<StructureImportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  importStructure(): void {
    this.isLoading = true;
    console.log(this.importTextControl.value);
  }

}
