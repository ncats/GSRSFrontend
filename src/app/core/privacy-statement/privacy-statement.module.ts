import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyStatementComponent } from './privacy-statement.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [PrivacyStatementComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatCardModule
  ],
  exports: [PrivacyStatementComponent]
})

export class PrivacyStatementModule { }
