/* eslint-disable max-len */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { HttpClientModule, HttpClientJsonpModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BaseComponent } from './base/base.component';
import { HomeComponent } from './home/home.component';
import { RegistrarsComponent } from './registrars/registrars.component';
import { SubstancesBrowseComponent } from './substances-browse/substances-browse.component';
import { configServiceFactory } from './config/config.factory';
import { ConfigService } from './config/config.service';
import { LoadingModule } from './loading/loading.module';
import { MainNotificationModule } from './main-notification/main-notification.module';
import { StructureSearchComponent } from './structure-search/structure-search.component';
import { StructureEditorModule } from './structure-editor/structure-editor.module';
import { FileSelectModule } from 'file-select';
import { SubstanceDetailsComponent } from './substance-details/substance-details.component';
import { DynamicComponentLoaderModule } from './dynamic-component-loader/dynamic-component-loader.module';
import { dynamicComponentManifests } from './app-dynamic-component-manifests';
import { ScrollToModule } from './scroll-to/scroll-to.module';
import { TakePipe } from './utils/take.pipe';
import { EnvironmentModule } from '../../environments/environment';
import { SubstanceTextSearchModule } from './substance-text-search/substance-text-search.module';
import { StructureImageModalComponent } from './structure/structure-image-modal/structure-image-modal.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule } from '@angular/material/core';
import { SequenceSearchComponent } from './sequence-search/sequence-search.component';
import { TrackLinkEventDirective } from './google-analytics/track-link-event/track-link-event.directive';
import { SubstanceCardsModule } from './substance-details/substance-cards.module';
import { substanceCardsFilters } from './substance-details/substance-cards-filters.constant';
import { AuthModule } from './auth/auth.module';
import { AuthInterceptor } from './auth/auth.interceptor';
import { SubstanceFormModule } from './substance-form/substance-form.module';
import { NameResolverModule } from './name-resolver/name-resolver.module';
import { HighlightedSearchActionComponent } from './highlighted-search-action/highlighted-search-action.component';
import { CardDynamicSectionDirective } from './substances-browse/card-dynamic-section/card-dynamic-section.directive';
import { SubstanceSummaryCardComponent } from './substances-browse/substance-summary-card/substance-summary-card.component';
import { SubstanceImageModule } from './substance/substance-image.module';
import { StructureModule } from './structure/structure.module';
import {MatTreeModule} from '@angular/material/tree';
import {SubstanceHierarchyComponent} from '@gsrs-core/substances-browse/substance-hierarchy/substance-hierarchy.component';
import {SequenceAlignmentComponent} from '@gsrs-core/substances-browse/sequence-alignment/sequence-alignment.component';
import { AdminModule } from '@gsrs-core/admin/admin.module';
import { FacetsManagerModule } from './facets-manager/facets-manager.module';
import { GuidedSearchModule } from './guided-search/guided-search.module';
import { CanActivateAdminPage } from '@gsrs-core/admin/can-activate-admin-page';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
import { NamesDisplayPipe } from '@gsrs-core/utils/names-display-order.pipe';
// eslint-disable-next-line max-len
import { BrowseHeaderDynamicSectionDirective } from '@gsrs-core/substances-browse/browse-header-dynamic-section/browse-header-dynamic-section.directive';
import { SubstanceHistoryDialogComponent } from '@gsrs-core/substance-history-dialog/substance-history-dialog.component';
import { SubstanceEditImportDialogComponent } from '@gsrs-core/substance-edit-import-dialog/substance-edit-import-dialog.component';
import { CodeDisplayModule } from '@gsrs-core/utils/code-display.module';
import { GlobalErrorHandler } from '@gsrs-core/error-handler/error-handler';
import { ShowMolfileDialogComponent } from
'@gsrs-core/substances-browse/substance-summary-card/show-molfile-dialog/show-molfile-dialog.component';
import { SubstanceStatusPipe } from '@gsrs-core/utils/substance-status.pipe';
import { UnauthorizedComponent } from '@gsrs-core/unauthorized/unauthorized.component';
import { SubstanceSsg4mModule } from './substance-ssg4m/substance-ssg4m.module';
import { SubstanceSsg4mProcessModule } from './substance-ssg4m/ssg4m-process/substance-form-ssg4m-process.module';
import { Ssg4mSitesModule } from './substance-ssg4m/ssg4m-sites/ssg4m-sites.module';
import { Ssg4mStagesModule } from './substance-ssg4m/ssg4m-stages/substance-form-ssg4m-stages.module';
import { SubstanceFormSsg4mStartingMaterialsModule } from './substance-ssg4m/ssg4m-starting-materials/substance-form-ssg4m-starting-materials.module';
import { SubstanceSsg2Module } from './substance-ssg2/substance-ssg2.module';
import { Ssg2ManufacturingModule } from './substance-ssg2/ssg2-manufacturing/ssg2-manufacturing.module';
import { CustomCheckboxWidgetComponent } from '@gsrs-core/substances-browse/export-dialog/custom-checkbox-widget/custom-checkbox-widget.component';
import {
  WidgetRegistry,
  DefaultWidgetRegistry,
  SchemaFormModule,
} from "ngx-schema-form";
import { MyWidgetRegistry } from '@gsrs-core/substances-browse/export-dialog/custom-checkbox-widget/custom-checkbox-registry';
import { CustomTextWidgetComponent } from '@gsrs-core/substances-browse/export-dialog/custom-text-widget/custom-text-widget.component';
import { CustomMultiselectWidgetComponent } from '@gsrs-core/substances-browse/custom-multiselect-widget/custom-multiselect-widget.component';
import { CustomSelectWidgetComponent } from '@gsrs-core/substances-browse/export-dialog/custom-select-widget/custom-select-widget.component';
import { CustomRadioWidgetComponent } from '@gsrs-core/substances-browse/export-dialog/custom-radio-widget/custom-radio-widget.component';
import { CustomMultiCheckboxWidgetComponent } from '@gsrs-core/substances-browse/export-dialog/custom-multi-checkbox-widget/custom-multi-checkbox-widget.component';
import { CustomTextareaWidgetComponent } from '@gsrs-core/substances-browse/export-dialog/custom-textarea-widget/custom-textarea-widget.component';

import { BulkSearchModule } from '@gsrs-core/bulk-search/bulk-search.module';
import { RegisterComponent } from './register/register.component';
import { PwdRecoveryComponent } from './pwd-recovery/pwd-recovery.component';
import { ElementLabelDisplayModule } from './utils/element-label-display.module';
import { MergeActionDialogComponent } from '@gsrs-core/admin/import-browse/merge-action-dialog/merge-action-dialog.component';
import { UserQueryListDialogComponent } from '@gsrs-core/bulk-search/user-query-list-dialog/user-query-list-dialog.component';
import { ListCreateDialogComponent } from '@gsrs-core/substances-browse/list-create-dialog/list-create-dialog.component';
import { ImportScrubberComponent } from '@gsrs-core/admin/import-management/import-scrubber/import-scrubber.component';
import { PrivacyStatementModule } from './privacy-statement/privacy-statement.module';
import { SessionCheckerComponent } from './auth/session-checker.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    BaseComponent,
    HomeComponent,
    UnauthorizedComponent,
    SubstancesBrowseComponent,
    StructureSearchComponent,
    SubstanceDetailsComponent,
    RegistrarsComponent,
    TakePipe,
    SequenceSearchComponent,
    TrackLinkEventDirective,
    HighlightedSearchActionComponent,
    CardDynamicSectionDirective,
    BrowseHeaderDynamicSectionDirective,
    SubstanceSummaryCardComponent,
    SubstanceHierarchyComponent,
    SequenceAlignmentComponent,
    ExportDialogComponent,
    SubstanceEditImportDialogComponent,
    SubstanceHistoryDialogComponent,
    ShowMolfileDialogComponent,
    NamesDisplayPipe,
    SubstanceStatusPipe,
    CustomCheckboxWidgetComponent,
    CustomTextWidgetComponent,
    CustomMultiselectWidgetComponent,
    CustomSelectWidgetComponent,
    CustomRadioWidgetComponent,
    CustomMultiCheckboxWidgetComponent,
    CustomTextareaWidgetComponent,
    RegisterComponent,
    PwdRecoveryComponent,
    MergeActionDialogComponent,
    UserQueryListDialogComponent,
    ImportScrubberComponent,
    ListCreateDialogComponent,
    SessionCheckerComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'gsrs' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCardModule,
    HttpClientModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatChipsModule,
    MatBadgeModule,
    MatExpansionModule,
    MatCheckboxModule,
    LoadingModule,
    MainNotificationModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatRadioModule,
    MatSliderModule,
    MatDialogModule,
    StructureEditorModule,
    FileSelectModule,
    MatGridListModule,
    MatListModule,
    DynamicComponentLoaderModule.forRoot(dynamicComponentManifests),
    ScrollToModule,
    EnvironmentModule.forRoot(),
    MatMenuModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatTabsModule,
    SubstanceTextSearchModule,
    SubstanceCardsModule.forRoot(substanceCardsFilters),
    AuthModule,
    SubstanceFormModule.forRoot(),
    OverlayModule,
    NameResolverModule,
    MatBottomSheetModule,
    MatProgressBarModule,
    SubstanceImageModule,
    StructureModule,
    MatTreeModule,
    FacetsManagerModule,
    GuidedSearchModule,
    MatNativeDateModule,
    AdminModule,
    FacetsManagerModule,
    CodeDisplayModule,
    SubstanceSsg4mModule,
    SubstanceSsg4mProcessModule,
    Ssg4mSitesModule,
    MatProgressSpinnerModule,
    Ssg4mStagesModule,
    SubstanceFormSsg4mStartingMaterialsModule,
    SubstanceSsg2Module,
    Ssg2ManufacturingModule,
    SchemaFormModule.forRoot(),   
    BulkSearchModule,
    ElementLabelDisplayModule,
    PrivacyStatementModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    { provide: WidgetRegistry, useClass: DefaultWidgetRegistry },
    CanActivateAdminPage,
    Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
    ConfigService,
    {
        provide: APP_INITIALIZER,
        useFactory: configServiceFactory,
        deps: [ConfigService],
        multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {provide: WidgetRegistry, useClass: MyWidgetRegistry}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    HighlightedSearchActionComponent,
    ExportDialogComponent,
    SubstanceEditImportDialogComponent,
    SubstanceHistoryDialogComponent,
    ShowMolfileDialogComponent,
    CustomCheckboxWidgetComponent,
    CustomTextWidgetComponent,
    CustomMultiselectWidgetComponent,
    CustomSelectWidgetComponent,
    CustomRadioWidgetComponent,
    CustomMultiCheckboxWidgetComponent,
    CustomTextareaWidgetComponent,
    MergeActionDialogComponent,
    UserQueryListDialogComponent,
    ListCreateDialogComponent,
    ImportScrubberComponent
  ],
  exports: [
    StructureEditorModule,
    NameResolverModule,
    NamesDisplayPipe,
    SubstanceStatusPipe
  ]
})
export class AppModule {}
