import { NgModule } from '@angular/core';
import { FileSelectDirective } from './file-select.directive';

@NgModule({
  imports: [FileSelectDirective],
  exports: [FileSelectDirective]
})
export class FileSelectModule { }
