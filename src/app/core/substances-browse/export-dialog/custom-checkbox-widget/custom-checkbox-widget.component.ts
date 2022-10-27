import { Component, OnInit } from '@angular/core';
import { TextAreaWidget, CheckboxWidget } from 'ngx-schema-form';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-checkbox-widget',
  templateUrl: './custom-checkbox-widget.component.html',
  styleUrls: ['./custom-checkbox-widget.component.scss']
})
export class CustomCheckboxWidgetComponent extends CheckboxWidget {
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
