import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvManagementComponent } from '@gsrs-core/admin/cv-management/cv-management.component';
import { MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule, MatCheckboxModule, MatTableDataSource, MatTableModule, MatSortModule, MatTooltipModule, MatProgressSpinnerModule, MatTabsModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from '@gsrs-core/admin/admin.component';
import { CvTermDialogComponent } from '@gsrs-core/admin/cv-management/cv-term-dialog/cv-term-dialog.component';
import { ScheduledJobsComponent } from '@gsrs-core/admin/scheduled-jobs/scheduled-jobs.component';
import { ScheduledJobComponent } from '@gsrs-core/admin/scheduled-jobs/scheduled-job/scheduled-job.component';
import { MomentModule } from 'ngx-moment';
import { UserManagementComponent } from '@gsrs-core/admin/user-management/user-management.component';



@NgModule({
  imports: [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  MatCardModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatTabsModule,
  MatProgressSpinnerModule,
  MatButtonModule,
  MatCheckboxModule,
    MatSortModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MomentModule,
  MatIconModule],
  declarations: [
    CvManagementComponent,
    ScheduledJobsComponent,
    AdminComponent,
    CvTermDialogComponent,
    ScheduledJobComponent,
    UserManagementComponent
  ],
  exports: [
    CvManagementComponent,
    ScheduledJobsComponent,
    ScheduledJobComponent,
    AdminComponent,
    CvTermDialogComponent,
    UserManagementComponent
  ],
  entryComponents: [
    CvTermDialogComponent
  ]
})
export class AdminModule { }
