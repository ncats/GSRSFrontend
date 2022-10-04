import { Component, OnInit } from '@angular/core';
import { SelectWidget } from 'ngx-schema-form';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';

@Component({
  selector: 'app-custom-multiselect-widget',
  templateUrl: './custom-multiselect-widget.component.html',
  styleUrls: ['./custom-multiselect-widget.component.scss']
})
export class CustomMultiselectWidgetComponent extends SelectWidget implements OnInit {
  options = [];

  constructor(
    private cvService: ControlledVocabularyService
  ) { 
    super();
    
  }

  ngOnInit(): void {
    this.cvService.fetchFullVocabulary(this.schema.CVDomain).subscribe(response => {
      console.log(response);
      if (response.content && response.content.length > 0) {
        this.options = response.content[0].terms;
      }
    });

    
  }

}
