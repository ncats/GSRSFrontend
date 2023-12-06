import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyStatementComponent } from './privacy-statement.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { Router, Routes, RouterModule } from '@angular/router';

const privacyStatmentRoutes: Routes = [
  {
    path: 'privacy-statement',
    component: PrivacyStatementComponent
  },
];

@NgModule({
  declarations: [PrivacyStatementComponent],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatCardModule
  ],
  exports: [PrivacyStatementComponent]
})

export class PrivacyStatementModule { 
  constructor(router: Router) {
    privacyStatmentRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
}

}