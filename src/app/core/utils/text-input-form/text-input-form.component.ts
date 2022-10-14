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
  @Input() showSubmitButton: boolean = false;
  @Input() showCancelButton: boolean = false;
  @Input() showLoadTextFileIntoTextarea: boolean = true;

  query: string;
  lineCount: number;
  maxCount: number = 10000;
  textControl = new FormControl();
  loadTextFileIntoTextareaError: String = ''; 

  constructor(
//    public dialogRef: MatDialogRef<TextInputFormComponent>,
//    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    // console.log("Temporarily setting a default value for Bulk Search text input form.")
    // this.textControl.setValue("sodium chloride\nsodium gluconate");
  }

  submit(): void {
  }

  cancel(): void {
  }

  loadTextFileIntoTextareaChangeListener($event) : void {
    this.readTextFile($event.target);
  }

  readTextFile(inputValue: any) : void {
    this.loadTextFileIntoTextareaError = '';
    var file:File = inputValue.files[0];
    if(file.type == 'text/plain') {
      var textFileReader:FileReader = new FileReader();
      var fc = this.textControl;

      textFileReader.onloadend = function(e){
        fc.setValue(textFileReader.result);
      }
      textFileReader.readAsText(file);
    } else {
      this.loadTextFileIntoTextareaError = "File of type 'text/plain' is required."; 
    }
  }
}
