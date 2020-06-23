import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
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
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
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
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
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

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    BaseComponent,
    HomeComponent,
    SubstancesBrowseComponent,
    StructureSearchComponent,
    SubstanceDetailsComponent,
    TakePipe,
    SequenceSearchComponent,
    TrackLinkEventDirective,
    HighlightedSearchActionComponent,
    CardDynamicSectionDirective,
    SubstanceSummaryCardComponent,
    SubstanceHierarchyComponent,
    SequenceAlignmentComponent,
    ExportDialogComponent,
    NamesDisplayPipe
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
    MatSliderModule,
    MatDialogModule,
    StructureEditorModule,
    FileSelectModule,
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
    FacetsManagerModule
  ],
  providers: [
    CanActivateAdminPage,
    ConfigService,
    {
        provide: APP_INITIALIZER,
        useFactory: configServiceFactory,
        deps: [ConfigService],
        multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    HighlightedSearchActionComponent,
    ExportDialogComponent
  ]
})
export class AppModule {}
