import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import { NgxJsonViewerModule} from 'ngx-json-viewer';
// GSRS Imports
import { FileSelectModule } from 'file-select';
import { ScrollToModule } from '@gsrs-core/scroll-to/scroll-to.module';
import { ExpandDetailsModule } from '@gsrs-core/expand-details/expand-details.module';
import { SubstanceSelectorModule } from '@gsrs-core/substance-selector/substance-selector.module';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';

import { CvInputComponent} from '@gsrs-core/substance-form/cv-input/cv-input.component';
import { CvDialogComponent} from '@gsrs-core/substance-form/cv-dialog/cv-dialog.component';
import { JsonDialogComponent} from '@gsrs-core/substance-form/json-dialog/json-dialog.component';
import { AuditInfoComponent} from '@gsrs-core/substance-form/audit-info/audit-info.component';

// import { SubmitSuccessDialogComponent } from './submit-success-dialog/submit-success-dialog.component';
// import { MergeConceptDialogComponent} from '@gsrs-core/substance-form/merge-concept-dialog/merge-concept-dialog.component';
// import { SubstanceFormComponent } from './substance-form.component';
// import { CanActivateSubstanceForm } from './can-activate-substance-form';
// import { CanRegisterSubstanceForm } from './can-register-substance-form';
// import { SubstanceFormService } from '../substance-form.service';
// import { AccessManagerComponent } from './access-manager/access-manager.component';
// import { SubstanceSsg4mService } from './substance-ssg4m-form.service';
// import { SubstanceFormComponent } from '../substance-form/substance-form.component';
// import { SubstanceFormSsg4mSitesService } from './ssg4m-sites/substance-form-ssg4m-sites.service.';
import { SubstanceFormSsg4mStartingMaterialsModule } from '../ssg4m-starting-materials/substance-form-ssg4m-starting-materials.module';
import { SubstanceFormSsg4mProcessingMaterialsModule } from '../ssg4m-processing-materials/substance-form-ssg4m-processing-materials.module';
import { SubstanceFormSsg4mResultingMaterialsModule } from '../ssg4m-resulting-materials/substance-form-ssg4m-resulting-materials.module';
import { SubstanceFormSsg4mStagesService } from './substance-form-ssg4m-stages.service';
import { Ssg4mStagesFormComponent } from './ssg4m-stages-form.component';

@NgModule({
  imports: [
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
    SubstanceFormSsg4mStartingMaterialsModule,
    SubstanceFormSsg4mProcessingMaterialsModule,
    SubstanceFormSsg4mResultingMaterialsModule
  ],
  declarations: [
  //  SubstanceFormComponent,
    Ssg4mStagesFormComponent
 //   CvInputComponent,
  //  CvDialogComponent,
 //   JsonDialogComponent
  ],
  exports: [
    Ssg4mStagesFormComponent
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

export class Ssg4mStagesModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: Ssg4mStagesModule,
      providers: [
      ]
    };
  }
}
