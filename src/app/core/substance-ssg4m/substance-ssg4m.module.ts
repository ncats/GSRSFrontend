import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ScrollToModule } from '../scroll-to/scroll-to.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRadioModule } from '@angular/material/radio';
import { ExpandDetailsModule } from '../expand-details/expand-details.module';
// import { AccessManagerComponent } from './access-manager/access-manager.component';
import { SubstanceSelectorModule } from '../substance-selector/substance-selector.module';
import { MatListModule } from '@angular/material/list';
import { FileSelectModule } from 'file-select';
import { CvInputComponent} from '@gsrs-core/substance-form/cv-input/cv-input.component';
import { CvDialogComponent} from '@gsrs-core/substance-form/cv-dialog/cv-dialog.component';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import { JsonDialogComponent} from '@gsrs-core/substance-form/json-dialog/json-dialog.component';
import { NgxJsonViewerModule} from 'ngx-json-viewer';
import { AuditInfoComponent} from '@gsrs-core/substance-form/audit-info/audit-info.component';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
// import { SubmitSuccessDialogComponent } from './submit-success-dialog/submit-success-dialog.component';
import { MergeConceptDialogComponent} from '@gsrs-core/substance-form/merge-concept-dialog/merge-concept-dialog.component';
import { MatProgressBarModule} from '@angular/material/progress-bar';
// import { SubstanceFormComponent } from './substance-form.component';
// import { CanActivateSubstanceForm } from './can-activate-substance-form';
// import { CanRegisterSubstanceForm } from './can-register-substance-form';
// import { SubstanceFormService } from '../substance-form.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SubstanceSsg4mService } from './substance-ssg4m-form.service';
import { SubstanceFormSsg4mProcessService } from './ssg4m-process/substance-form-ssg4m-process.service';
import { SubstanceSsg4ManufactureFormComponent } from './substance-ssg4m-form.component';
import { SubstanceFormComponent } from '../substance-form/substance-form.component';
// import { SubstanceFormSsg4mSitesService } from './ssg4m-sites/substance-form-ssg4m-sites.service.';
import { SubstanceSsg4mProcessModule } from './ssg4m-process/substance-form-ssg4m-process.module';
import { Ssg4mSitesModule } from './ssg4m-sites/ssg4m-sites.module';
import { Ssg4mStepViewDialogModule } from './ssg4m-step-view-dialog/ssg4m-step-view-dialog.module';


const ssg4mRoutes: Routes = [
  {
    path: 'substances-ssg4m/register',
    component: SubstanceSsg4ManufactureFormComponent
    //  canActivate: [CanRegisterSubstanceForm],
    //  canDeactivate: [CanDeactivateSubstanceFormGuard]
  },
  {
    path: 'substances-ssg4m/:id/edit',
    component: SubstanceSsg4ManufactureFormComponent,
    //  canActivate: [CanRegisterSubstanceForm],
    //  canDeactivate: [CanDeactivateSubstanceFormGuard]
  }
  // ,
  // {
  //  path: 'substances-ssg4m/:id',
  //  component: SubstanceSsg4ManufactureFormComponent
  // }
];

@NgModule({
  imports: [
    RouterModule.forChild(ssg4mRoutes),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatMenuModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatDividerModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    ScrollToModule,
    MatDialogModule,
    MatTableModule,
    MatExpansionModule,
    MatBadgeModule,
    MatRadioModule,
    ExpandDetailsModule,
    SubstanceSelectorModule,
    MatListModule,
    FileSelectModule,
    MatButtonToggleModule,
    NgxJsonViewerModule,
    RouterModule,
    SubstanceImageModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    Ssg4mStepViewDialogModule
  //  SubstanceSsg4mProcessModule
  //  Ssg4mSitesModule
  ],
  declarations: [
  //  SubstanceFormComponent,
    SubstanceSsg4ManufactureFormComponent
 //   CvInputComponent,
  //  CvDialogComponent,
 //   JsonDialogComponent
  ],
  exports: [
  //  SubstanceFormComponent,
  // SubstanceSsg4ManufactureFormComponent,
  //  CvInputComponent,
  //  CvDialogComponent,
  //  JsonDialogComponent,
  ],
  entryComponents: [
  //  CvDialogComponent,
 //   JsonDialogComponent,
 //   AuditInfoComponent,
  //  SubmitSuccessDialogComponent,
  ]
})

export class SubstanceSsg4mModule {
  constructor(router: Router) {
    ssg4mRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SubstanceSsg4mModule,
      providers: [
     //   SubstanceSsg4mService,
     //   SubstanceFormSsg4mProcessService,
     //   SubstanceFormSsg4mSitesService
      ]
    };
  }
}
