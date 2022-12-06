import { ElementLabelDisplayPipe } from '@gsrs-core/utils/element-label-display.pipe';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
      // dep modules
    ],
    declarations: [
        ElementLabelDisplayPipe
    ],
    exports: [
        ElementLabelDisplayPipe
    ]
  })
  export class ElementLabelDisplayModule {}