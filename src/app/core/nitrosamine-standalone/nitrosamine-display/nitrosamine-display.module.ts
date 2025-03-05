import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NitrosamineDisplayComponent } from './nitrosamine-display.component';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [NitrosamineDisplayComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule

  ],
  exports: [
    NitrosamineDisplayComponent
  ]
})
export class NitrosamineDisplayModule { }
