import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvManagementComponent } from '@gsrs-core/admin/cv-management/cv-management.component';
import { MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatCardModule, MatCheckboxModule, MatTableDataSource, MatTableModule, MatSortModule, MatTooltipModule, MatProgressSpinnerModule, MatTabsModule, MatDialogModule, MatPaginatorModule, MatSelectModule, MatProgressBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from '@gsrs-core/admin/admin.component';
import { CvTermDialogComponent } from '@gsrs-core/admin/cv-management/cv-term-dialog/cv-term-dialog.component';
import { ScheduledJobsComponent } from '@gsrs-core/admin/scheduled-jobs/scheduled-jobs.component';
import { ScheduledJobComponent } from '@gsrs-core/admin/scheduled-jobs/scheduled-job/scheduled-job.component';
import { MomentModule } from 'ngx-moment';
import { UserManagementComponent } from '@gsrs-core/admin/user-management/user-management.component';
import { UserEditDialogComponent } from '@gsrs-core/admin/user-management/user-edit-dialog/user-edit-dialog.component';
import { CacheSummaryComponent } from '@gsrs-core/admin/cache-summary/cache-summary.component';
import { DataManagementComponent } from '@gsrs-core/admin/data-management/data-management.component';
import { MonitorComponent } from '@gsrs-core/admin/monitor/monitor.component';
import { CanActivateAdmin } from '@gsrs-core/admin/can-activate-admin';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



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
  MatTooltipModule,
  BrowserAnimationsModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatSelectModule,
    MatSortModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MomentModule,
    MatPaginatorModule,
  MatIconModule],
  declarations: [
    CvManagementComponent,
    ScheduledJobsComponent,
    AdminComponent,
    CvTermDialogComponent,
    ScheduledJobComponent,
    UserManagementComponent,
    UserEditDialogComponent,
    CacheSummaryComponent,
    DataManagementComponent,
    MonitorComponent
  ],
  exports: [
    CvManagementComponent,
    ScheduledJobsComponent,
    ScheduledJobComponent,
    AdminComponent,
    CvTermDialogComponent,
    UserEditDialogComponent,
    UserManagementComponent,
    CacheSummaryComponent,
    DataManagementComponent,
    MonitorComponent
  ],
  entryComponents: [
    CvTermDialogComponent,
    UserEditDialogComponent
  ],
  providers: [
    CanActivateAdmin
  ]
})
export class AdminModule { }
