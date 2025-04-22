import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NitrosamineDisplayComponent } from './nitrosamine-display.component';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [NitrosamineDisplayComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    HttpClientModule
  ],
  exports: [
    NitrosamineDisplayComponent
  ]
})
export class NitrosamineDisplayModule { }
