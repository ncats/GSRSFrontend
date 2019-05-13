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
import { SubstanceAddEditComponent } from './substance-add-edit/substance-add-edit.component';
import { CanActivateSubstanceAddEdit } from './substance-add-edit/can-activate-substance-add-edit';

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
    path: 'substances/:id',
    component: SubstanceDetailsComponent
  },
  {
    path: 'structure-search',
    component: StructureSearchComponent
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
    path: 'substances/register',
    component: SubstanceAddEditComponent
  },
  {
    path: 'substances/:id/edit',
    component: SubstanceAddEditComponent,
    canActivate: [CanActivateSubstanceAddEdit]
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
