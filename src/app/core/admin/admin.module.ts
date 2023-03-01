import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvManagementComponent } from '@gsrs-core/admin/cv-management/cv-management.component';
// eslint-disable-next-line max-len
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatTreeModule} from '@angular/material/tree';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatFormFieldModule} from '@angular/material/form-field';
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
import { AllFilesComponent } from '@gsrs-core/admin/all-files/all-files.component';
import { FragmentWizardComponent } from '@gsrs-core/admin/fragment-wizard/fragment-wizard.component';
import { StructureEditorModule } from '@gsrs-core/structure-editor';
import { ImportManagementComponent } from '@gsrs-core/admin/import-management/import-management.component';
import { MatRadioModule } from '@angular/material/radio';
import { ImportBrowseComponent } from '@gsrs-core/admin/import-browse/import-browse.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FacetsManagerModule } from '@gsrs-core/facets-manager';
import { ImportSummaryComponent } from '@gsrs-core/admin/import-browse/import-summary/import-summary.component';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { ImportDialogComponent } from '@gsrs-core/admin/import-management/import-dialog/import-dialog.component';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { CvImportComponent } from '@gsrs-core/admin/import-management/cv-import/cv-mport.component';
import { MatChipsModule } from '@angular/material/chips';



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
  MatTreeModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatSelectModule,
  RouterModule,
  MatMenuModule,
    MatSortModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MomentModule,
    MatPaginatorModule,
    MatIconModule,
    MatRadioModule,
    MatSidenavModule,
    MatChipsModule,
  StructureEditorModule,
  FacetsManagerModule,
  SubstanceImageModule
],
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
    MonitorComponent,
    AllFilesComponent,
    FragmentWizardComponent,
    ImportManagementComponent,
    ImportBrowseComponent,
    ImportSummaryComponent,
    ImportDialogComponent,
    CvImportComponent
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
    MonitorComponent,
    AllFilesComponent,
    FragmentWizardComponent,
    ImportManagementComponent,
    ImportBrowseComponent,
    ImportSummaryComponent,
    ImportDialogComponent,
    CvImportComponent

  ],
  entryComponents: [
    CvTermDialogComponent,
    UserEditDialogComponent,
    ImportDialogComponent,
    CvImportComponent

  ],
  providers: [
    CanActivateAdmin,
    {
      provide: MatDialogRef,
      useValue: {}
    },
  ]
})
export class AdminModule { }