import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-export-dialog',
  template: '<sf-form [schema]="exportSchema" [(model)]="data" [actions]="exportActions"></sf-form>{{data | json}}',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent implements OnInit {
  exportSchema = {
    type: "object",
    title: "Enter a Filename",
    description: "Preparing download. Please enter a file name.",
    properties: {
      name: {
        type: "string",
        title: "Filename",
        description: "Filename"
      },
      extension: {
        type: "string",
        title: "Extension",
        description: "Extension"
      },
      publicOnly: {
        type: "boolean",
        title: "Public Only",
        default: false,
        description: "Public Only"
      }
    },
    buttons : [
      {
        id: "save",
        label: "Save"
      },
      {
        id: "cancel",
        label: "Cancel"
      }
    ]
  };
  data = {};
  exportActions = {
     save: (property) => {
        this.dialogRef.close(JSON.stringify(property.value));
     },
     cancel: (property) => {
        this.dialogRef.close();
     },
  }
//  constructor(
//    public dialogRef: MatDialogRef<ExportDialogComponent>,
//    @Inject(MAT_DIALOG_DATA) public data: any
//  ) { }

  ngOnInit() {
    const date = new Date();
    if (this.data.type && this.data.type !== null && this.data.type !== '') {
      this.data.name = this.data.type + '-' + moment(date).format('DD-MM-YYYY_H-mm-ss');
    } else {
      this.data.name = 'export-' + moment(date).format('DD-MM-YYYY_H-mm-ss');
    }
    if (this.data.schema && this.data.schema !== null && this.data.schema !== '') {
      this.exportSchema = this.data.schema;
      delete this.data.schema;
    }
  }

  save(): void {
    this.dialogRef.close(this.data.name);
  }

  cancel(): void {
    this.dialogRef.close();
  }

}

