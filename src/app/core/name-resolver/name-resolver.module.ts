import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NameResolverComponent } from './name-resolver.component';
import { NameResolverDialogComponent } from './name-resolver-dialog.component';
import { ExternalSiteWarningDialogComponent } from './external-site-warning-dialog/external-site-warning-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    NameResolverComponent,
    NameResolverDialogComponent,
    ExternalSiteWarningDialogComponent
  ],
  exports: [
    NameResolverComponent,
    NameResolverDialogComponent
  ]
})
export class NameResolverModule { }
