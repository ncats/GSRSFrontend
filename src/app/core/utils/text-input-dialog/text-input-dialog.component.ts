import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { split } from 'lodash';
@Component({
  selector: 'app-text-input-dialog',
  templateUrl: './text-input-dialog.component.html',
  styleUrls: ['./text-input-dialog.component.scss']
})





export class TextInputDialogComponent implements OnInit {
  query: string;
  lineCount: number;
  maxCount: number = 1000;
  textControl = new FormControl();
  constructor(
    public dialogRef: MatDialogRef<TextInputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  save(): void {
    this.query = this.makeOrSearch('root_names_name');
    this.dialogRef.close(this.query);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  makeOrSearch(field: string){
    let a:Array<string> = [];
    let b:Array<string> = [];
    let query = "";
    // alert(this.textControl.value);
    const re1 = new RegExp(/\n/);
    const re2 = new RegExp(/^\s*$/);
    if(this.textControl.value) {
      query = this.textControl.value.split(re1).map(function(element) {
        if(!re2.test(element)) {
          return field + ':"^' +  element +'$"';          
        } else { 
          return '';
        }
      }).filter(x => typeof x === 'string' && x.length > 0).join(' OR ');
      console.log("QUERY: "+ query);
    }
    return query;
  }
}
