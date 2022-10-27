import { CustomCheckboxWidgetComponent } from '@gsrs-core/substances-browse/export-dialog/custom-checkbox-widget/custom-checkbox-widget.component';
import { DefaultWidgetRegistry } from 'ngx-schema-form';
import { CustomTextWidgetComponent } from '@gsrs-core/substances-browse/export-dialog/custom-text-widget/custom-text-widget.component';
import { CustomMultiselectWidgetComponent } from '@gsrs-core/substances-browse/custom-multiselect-widget/custom-multiselect-widget.component';
import { CustomSelectWidgetComponent } from '@gsrs-core/substances-browse/export-dialog/custom-select-widget/custom-select-widget.component';
import { CustomRadioWidgetComponent } from '@gsrs-core/substances-browse/export-dialog/custom-radio-widget/custom-radio-widget.component';
import { CustomMultiCheckboxWidgetComponent } from '@gsrs-core/substances-browse/export-dialog/custom-multi-checkbox-widget/custom-multi-checkbox-widget.component';
import { CustomTextareaWidgetComponent } from '@gsrs-core/substances-browse/export-dialog/custom-textarea-widget/custom-textarea-widget.component';

export class MyWidgetRegistry extends DefaultWidgetRegistry {
  constructor() {
    super();

    this.register("boolean", CustomCheckboxWidgetComponent);
    this.register("string", CustomTextWidgetComponent);
    this.register("multi-select", CustomMultiselectWidgetComponent);
    this.register("select", CustomSelectWidgetComponent);
    this.register("radio", CustomRadioWidgetComponent);
    this.register("checkbox", CustomMultiCheckboxWidgetComponent);
    this.register("textarea", CustomTextareaWidgetComponent);




  }
}