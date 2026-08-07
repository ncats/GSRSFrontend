import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyStatementComponent } from './privacy-statement.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { Routes, RouterModule } from '@angular/router';

const privacyStatmentRoutes: Routes = [
  {
    path: '',
    component: PrivacyStatementComponent
  },
];

@NgModule({
  declarations: [PrivacyStatementComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatCardModule,
    RouterModule.forChild(privacyStatmentRoutes)
  ],
  exports: [PrivacyStatementComponent]
})

export class PrivacyStatementModule { }