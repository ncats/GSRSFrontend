import { Component, OnInit } from '@angular/core';
import { ControlWidget } from 'ngx-schema-form';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-textarea-widget',
  templateUrl: './custom-textarea-widget.component.html',
  styleUrls: ['./custom-textarea-widget.component.scss']
})
export class CustomTextareaWidgetComponent extends ControlWidget {

  constructor(
    private dialog: MatDialog
  ) { 
    super();
    
  }
 
  openModal(templateRef, comments) {
    let dialogRef = this.dialog.open(templateRef, {
     width: '300px', data: {comment: comments}
   });

  }

}
