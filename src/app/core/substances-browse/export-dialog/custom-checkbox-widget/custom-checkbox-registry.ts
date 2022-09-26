import { CustomCheckboxWidgetComponent } from '@gsrs-core/substances-browse/export-dialog/custom-checkbox-widget/custom-checkbox-widget.component';
import { DefaultWidgetRegistry } from 'ngx-schema-form';
import { CustomTextWidgetComponent } from '@gsrs-core/substances-browse/export-dialog/custom-text-widget/custom-text-widget.component';

export class MyWidgetRegistry extends DefaultWidgetRegistry {
  constructor() {
    super();

    this.register("boolean", CustomCheckboxWidgetComponent);
    this.register("string", CustomTextWidgetComponent);

  }
}