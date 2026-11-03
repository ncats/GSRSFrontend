import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TextAreaWidget, CheckboxWidget, SchemaFormModule } from 'ngx-schema-form';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-custom-checkbox-widget',
    templateUrl: './custom-checkbox-widget.component.html',
    styleUrls: ['./custom-checkbox-widget.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatIconModule, SchemaFormModule]
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
