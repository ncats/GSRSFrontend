import { Component, OnInit } from '@angular/core';
import { TextAreaWidget, CheckboxWidget } from 'ngx-schema-form';

@Component({
  selector: 'app-custom-checkbox-widget',
  templateUrl: './custom-checkbox-widget.component.html',
  styleUrls: ['./custom-checkbox-widget.component.scss']
})
export class CustomCheckboxWidgetComponent extends CheckboxWidget {


}
