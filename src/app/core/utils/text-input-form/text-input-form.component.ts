import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-text-input-form',
  templateUrl: './text-input-form.component.html',
  styleUrls: ['./text-input-form.component.scss']
})

export class TextInputFormComponent implements OnInit {
  @Input() placeholder = 'placeholder';
  @Input() instruction = 'Enter text';
  @Input() maxCount = 10000;
  @Input() showSubmitButton = false;
  @Input() showCancelButton = false;
  @Input() showLoadTextFileIntoTextarea = true;

  query: string;
  lineCount: number;
  textControl = new FormControl();
  loadTextFileIntoTextareaError = '';

  constructor(
  ) { }

  ngOnInit() {
  }

  submit(): void {
  }

  cancel(): void {
  }

  loadTextFileIntoTextareaChangeListener($event): void {
    this.readTextFile($event.target);
  }

  readTextFile(inputValue: any): void {
    this.loadTextFileIntoTextareaError = '';
    const file: File = inputValue.files[0];
    if(file.type === 'text/plain') {
      const textFileReader: FileReader = new FileReader();
      const fc = this.textControl;

      textFileReader.onloadend = (e) => {
        fc.setValue(textFileReader.result);
      };
      textFileReader.readAsText(file);
    } else {
      this.loadTextFileIntoTextareaError = 'File of type \'text/plain\' is required.';
    }
  }
}
