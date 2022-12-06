import { CodeSystemDisplayPipe } from '@gsrs-core/utils/code-system-display.pipe';
import { NgModule } from '@angular/core';
import { RelationshipDisplayPipe } from '@gsrs-core/utils/relationship-display.pipe.';

@NgModule({
    imports: [
      // dep modules
    ],
    declarations: [
      CodeSystemDisplayPipe,
      RelationshipDisplayPipe
    ],
    exports: [
        CodeSystemDisplayPipe,
        RelationshipDisplayPipe
    ]
  })
  export class CodeDisplayModule {}