import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BaseComponent } from './base/base.component';
import { HomeComponent } from './home/home.component';
import { SubstancesBrowseComponent } from './substances-browse/substances-browse.component';
import { StructureSearchComponent } from './structure-search/structure-search.component';
import { SubstanceDetailsComponent } from './substance-details/substance-details.component';
import { SequenceSearchComponent } from './sequence-search/sequence-search.component';
import { LoginComponent } from './auth/login/login.component';
import { SubstanceFormComponent } from './substance-form/substance-form.component';
import { CanActivateSubstanceForm } from './substance-form/can-activate-substance-form';
import {CanRegisterSubstanceForm} from '@gsrs-core/substance-form/can-register-substance-form';
import { CanDeactivateSubstanceFormGuard } from './substance-form/can-deactivate-substance-form.guard';
import { GuidedSearchComponent } from './guided-search/guided-search.component';
import { AdminComponent } from '@gsrs-core/admin/admin.component';
import { UserProfileComponent } from '@gsrs-core/auth/user-profile/user-profile.component';
import { UserDownloadsComponent } from '@gsrs-core/auth/user-downloads/user-downloads.component';
import { MonitorComponent } from '@gsrs-core/admin/monitor/monitor.component';
import { CanActivateAdmin } from '@gsrs-core/admin/can-activate-admin';
import { CanActivateAdminPage } from './admin/can-activate-admin-page';

const childRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'browse-substance',
    component: SubstancesBrowseComponent
  },
  {
    path: 'substances/register',
    component: SubstanceFormComponent,
    canActivate: [CanRegisterSubstanceForm],
    canDeactivate: [CanDeactivateSubstanceFormGuard]
  },
  {
    path: 'substances/register/:type',
    component: SubstanceFormComponent,
    canActivate: [CanRegisterSubstanceForm],
    canDeactivate: [CanDeactivateSubstanceFormGuard]
  },
  {
    path: 'substances/:id',
    component: SubstanceDetailsComponent
  },
  {
    path: 'substances/:id/v/:version',
    component: SubstanceDetailsComponent
  },
  {
    path: 'structure-search',
    component: StructureSearchComponent
  },
  {
    path: 'guided-search',
    component: GuidedSearchComponent
  },
  {
    path: 'sequence-search',
    component: SequenceSearchComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'substances/:id/edit',
    component: SubstanceFormComponent,
    canActivate: [CanActivateSubstanceForm],
    canDeactivate: [CanDeactivateSubstanceFormGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [CanActivateAdmin]

  },
  {
    path: 'monitor/:id',
    component: MonitorComponent,
    canActivate: [CanActivateAdmin]
  },
  {
    path: 'profile',
    component: UserProfileComponent
  },
  {
    path: 'user-downloads',
    component: UserDownloadsComponent
  },
  {
    path: 'user-downloads/:id',
    component: UserDownloadsComponent

  }
];

const routes: Routes = [
  {
    path: '',
    children: childRoutes,
    component: BaseComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
