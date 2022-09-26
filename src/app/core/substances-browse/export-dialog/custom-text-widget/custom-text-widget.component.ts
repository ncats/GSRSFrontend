import { Component, OnInit } from '@angular/core';
import { TextAreaWidget, CheckboxWidget, StringWidget } from 'ngx-schema-form';

@Component({
  selector: 'app-custom-text-widget',
  templateUrl: './custom-text-widget.component.html',
  styleUrls: ['./custom-text-widget.component.scss']
})
export class CustomTextWidgetComponent extends StringWidget {


}
