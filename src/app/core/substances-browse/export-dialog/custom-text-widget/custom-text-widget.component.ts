import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TextAreaWidget, CheckboxWidget, StringWidget } from 'ngx-schema-form';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-custom-text-widget',
    templateUrl: './custom-text-widget.component.html',
    styleUrls: ['./custom-text-widget.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatIconModule]
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
