import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { SelectWidget, SchemaFormModule } from 'ngx-schema-form';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-custom-select-widget',
    templateUrl: './custom-select-widget.component.html',
    styleUrls: ['./custom-select-widget.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatOptionModule, MatIconModule, SchemaFormModule]
})
export class CustomSelectWidgetComponent extends SelectWidget implements OnInit {
  options = [];

  constructor(
    private cvService: ControlledVocabularyService,
    private dialog: MatDialog
  ) { 
    super();
    
  }

  ngOnInit(): void {
    if (this.schema.CVDomain) {

   
    this.cvService.fetchFullVocabulary(this.schema.CVDomain).subscribe(response => {
      if (response.content && response.content.length > 0) {
        this.options = response.content[0].terms;
      }
    });

    
  }
}
openModal(templateRef, comments) {
  let dialogRef = this.dialog.open(templateRef, {
   width: '300px', data: {comment: comments}
 });

}
}
