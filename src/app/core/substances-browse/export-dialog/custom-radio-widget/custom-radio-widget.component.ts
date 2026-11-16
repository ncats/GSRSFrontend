import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { SelectWidget, SchemaFormModule } from 'ngx-schema-form';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-custom-radio-widget',
    templateUrl: './custom-radio-widget.component.html',
    styleUrls: ['./custom-radio-widget.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatTooltipModule, SchemaFormModule]
})
export class CustomRadioWidgetComponent  extends SelectWidget implements OnInit {
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
