import { Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { CanActivateSubstanceForm } from './substance-form/can-activate-substance-form';
import {CanRegisterSubstanceForm} from '@gsrs-core/substance-form/can-register-substance-form';
import { CanDeactivateSubstanceFormGuard } from './substance-form/can-deactivate-substance-form.guard';
import { CanActivateAdmin } from '@gsrs-core/admin/can-activate-admin';
import { EXTRA_ROUTES } from '../../environments/environment';
import { SSG2_ROUTES } from './substance-ssg2/ssg2.routes';
import { SSG4M_ROUTES } from './substance-ssg4m/ssg4m.routes';

const childRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(c => c.HomeComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./unauthorized/unauthorized.component').then(c => c.UnauthorizedComponent)
  },
  {
    path: 'browse-substance',
    loadComponent: () => import('./substances-browse/substances-browse.component').then(c => c.SubstancesBrowseComponent)
  },
  {
    path: 'registrars',
    loadComponent: () => import('./registrars/registrars.component').then(c => c.RegistrarsComponent)
  },
  {
    path: 'substances/register',
    loadComponent: () => import('./substance-form/substance-form.component').then(c => c.SubstanceFormComponent)
  },
  {
    path: 'substances/register/:type',
    loadComponent: () => import('./substance-form/substance-form.component').then(c => c.SubstanceFormComponent),
    canActivate: [CanRegisterSubstanceForm],
    canDeactivate: [CanDeactivateSubstanceFormGuard]
  },
  {
    path: 'substances/:id',
    loadComponent: () => import('./substance-details/substance-details.component').then(c => c.SubstanceDetailsComponent)
  },
  {
    path: 'substances/:id/v/:version',
    loadComponent: () => import('./substance-details/substance-details.component').then(c => c.SubstanceDetailsComponent)
  },
  {
    path: 'structure-search',
    loadComponent: () => import('./structure-search/structure-search.component').then(c => c.StructureSearchComponent)
  },
  {
    path: 'guided-search',
    loadChildren: () => import('./guided-search/guided-search.routes').then(r => r.GUIDED_SEARCH_ROUTES)
  },
  {
    path: 'bulk-search',
    loadComponent: () => import('./bulk-search/bulk-query.component').then(c => c.BulkQueryComponent)
  },
  {
    path: 'bulk-search-results',
    loadComponent: () => import('./bulk-search/bulk-search.component').then(c => c.BulkSearchComponent)
  },
  {
    path: 'sequence-search',
    loadComponent: () => import('./sequence-search/sequence-search.component').then(c => c.SequenceSearchComponent)
  },
  {
    path: 'staging',
    loadComponent: () => import('./admin/import-browse/import-browse.component').then(c => c.ImportBrowseComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'substances/:id/edit',
    loadComponent: () => import('./substance-form/substance-form.component').then(c => c.SubstanceFormComponent),
    canActivate: [CanActivateSubstanceForm],
    canDeactivate: [CanDeactivateSubstanceFormGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(r => r.ADMIN_ROUTES)
  },
  {
    path: 'monitor/:id',
    loadComponent: () => import('./admin/monitor/monitor.component').then(c => c.MonitorComponent),
    canActivate: [CanActivateAdmin]
  },
  {
    path: 'profile',
    loadComponent: () => import('./auth/user-profile/user-profile.component').then(c => c.UserProfileComponent)
  },
  {
    path: 'user-downloads',
    loadComponent: () => import('./auth/user-downloads/user-downloads.component').then(c => c.UserDownloadsComponent)
  },
  {
    path: 'user-downloads/:id',
    loadComponent: () => import('./auth/user-downloads/user-downloads.component').then(c => c.UserDownloadsComponent)
  },
  {
    path: 'structure-features',
    loadComponent: () => import('./substance-form/substance-form.component').then(m => m.SubstanceFormComponent)
  },
  {
    path: 'privacy-statement',
    loadChildren: () => import('./privacy-statement/privacy-statement.routes').then(r => r.PRIVACY_STATEMENT_ROUTES)
  },
  {
    path: 'nitrosamine-standalone',
    loadChildren: () => import('./nitrosamine-standalone/nitrosamine-standalone.routes').then(r => r.NITROSAMINE_STANDALONE_ROUTES)
  },
  ...EXTRA_ROUTES,
  // Previously injected at runtime by SubstanceSsg2Module/SubstanceSsg4mModule constructors
  // (router.config[0].children.push(...)), which ran after RouterModule.forRoot() had already
  // processed EXTRA_ROUTES — kept after EXTRA_ROUTES here to preserve that same match order.
  ...SSG2_ROUTES,
  ...SSG4M_ROUTES,
];

export const routes: Routes = [
  {
    path: '',
    children: childRoutes,
    component: BaseComponent
  },
  {
    path: '**',
    loadComponent: () => import('./page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent)
  }
];
