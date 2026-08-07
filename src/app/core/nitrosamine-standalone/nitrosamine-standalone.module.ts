import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NitrosamineStandaloneComponent } from './nitrosamine-standalone.component';
import { Routes, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NitrosamineDisplayModule } from './nitrosamine-display/nitrosamine-display.module';
import { MatCardModule } from '@angular/material/card';
import { StructureEditorModule } from '@gsrs-core/structure-editor';

const nitrosamineRoutes: Routes = [
  {
    path: '',
    component: NitrosamineStandaloneComponent
  },
];

@NgModule({
  declarations: [
    NitrosamineStandaloneComponent

  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    NitrosamineDisplayModule,
    MatCardModule,
    StructureEditorModule,
    RouterModule.forChild(nitrosamineRoutes)
  ],exports: [
    NitrosamineStandaloneComponent
  ]
})
export class NitrosamineStandaloneModule { }
