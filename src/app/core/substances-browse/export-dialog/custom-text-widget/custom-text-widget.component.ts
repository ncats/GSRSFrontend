import { Component, OnInit } from '@angular/core';
import { TextAreaWidget, CheckboxWidget, StringWidget } from 'ngx-schema-form';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-text-widget',
  templateUrl: './custom-text-widget.component.html',
  styleUrls: ['./custom-text-widget.component.scss']
})
export class CustomTextWidgetComponent extends StringWidget {
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
