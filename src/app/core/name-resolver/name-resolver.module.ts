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
import { ExternalSiteWarningDialogComponent } from './external-site-warning-dialog/external-site-warning-dialog.component';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    RouterModule,
    LoadingModule,
    SubstanceImageModule
  ],
  declarations: [
    NameResolverComponent,
    NameResolverDialogComponent,
    ExternalSiteWarningDialogComponent
  ],
  exports: [
    NameResolverComponent,
    NameResolverDialogComponent
  ],
  entryComponents: [
    NameResolverDialogComponent,
    ExternalSiteWarningDialogComponent
  ]
})
export class NameResolverModule { }
