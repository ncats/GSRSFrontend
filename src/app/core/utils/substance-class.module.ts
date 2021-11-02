import {SubstanceClassPipe} from '@gsrs-core/utils/substance-class.pipe';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [
      // dep modules
    ],
    declarations: [
        SubstanceClassPipe
    ],
    exports: [
        SubstanceClassPipe
    ]
  })
  export class SubstanceClassModule {}