import { Component, OnInit, Inject, Input } from '@angular/core';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { split } from 'lodash';
@Component({
  selector: 'app-text-input-form',
  templateUrl: './text-input-form.component.html',
  styleUrls: ['./text-input-form.component.scss']
})



export class TextInputFormComponent implements OnInit {
  @Input() placeholder: string = "Input";
  @Input() instruction: string = "Enter text";

  query: string;
  lineCount: number;
  maxCount: number = 1000;
  textControl = new FormControl();
  constructor(
//    public dialogRef: MatDialogRef<TextInputFormComponent>,
//    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
  }

  submit(): void {
  }

  cancel(): void {
    // this.dialogRef.close();
  }


}
