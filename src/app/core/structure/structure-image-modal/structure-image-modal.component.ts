import { Component, Inject, OnInit } from '@angular/core';
import { UtilsService } from '../../utils/utils.service';
import {MAT_DIALOG_DATA, MatDialogRef, } from '@angular/material';
import { SafeUrl } from '@angular/platform-browser';
import { StructureService } from '../structure.service';

@Component({
  selector: 'app-structure-image-modal',
  templateUrl: './structure-image-modal.component.html',
  styleUrls: ['./structure-image-modal.component.scss']
})
export class StructureImageModalComponent implements OnInit {
  structure: string;
  smiles: string;
  inchi: string;
  names: string[] = [];
  constructor(
    private utilsService: UtilsService,
    private structureService: StructureService,
    public dialogRef: MatDialogRef<StructureImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.structure = (this.data && this.data.structure) ? this.data.structure : null;
    if (this.data.smiles) {
      this.smiles = this.data.smiles;
      this.structureService.getOtherInchi(this.data.uuid).subscribe(inchi => {
        this.inchi = inchi;
      });
    }
    if (this.data && this.data.names && this.data.names.length) {
      for (const name of this.data.names) {
        if (name.type === 'sys') {
          this.names.push(name.name);
        }
      }
    }
  }

  dismissDialog(): void {
    this.dialogRef.close();
  }

}
