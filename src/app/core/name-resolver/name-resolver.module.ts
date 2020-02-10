import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NameResolverComponent } from './name-resolver.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LoadingModule } from '../loading/loading.module';
import { NameResolverDialogComponent } from './name-resolver-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    LoadingModule
  ],
  declarations: [
    NameResolverComponent,
    NameResolverDialogComponent
  ],
  exports: [
    NameResolverComponent,
    NameResolverDialogComponent
  ],
  entryComponents: [
    NameResolverDialogComponent
  ]
})
export class NameResolverModule { }
