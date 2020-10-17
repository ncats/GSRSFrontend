import { CodeSystemDisplayPipe } from '@gsrs-core/utils/code-system-display.pipe';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
      // dep modules
    ],
    declarations: [
      CodeSystemDisplayPipe
    ],
    exports: [
        CodeSystemDisplayPipe
    ]
  })
  export class CodeDisplayModule {}