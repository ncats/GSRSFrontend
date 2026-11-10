import { Routes } from "@angular/router";

export const FDA_ROUTES: Routes = [
    {
    path: '',
    loadChildren: () => import('./clinical-trials/clinical-trials.routes').then(r => r.CLINICAL_TRIALS_ROUTES)
  },
  {
    path: '',
    loadChildren: () => import('./adverse-event/adverse-event.routes').then(r => r.ADVERSE_EVENT_ROUTES)
  },
  {
    path: '',
    loadChildren: () => import('./application/application.routes').then( r => r.APPLICATION_ROUTES)
  },
  {
    path: '',
    loadChildren: ()=> import('./impurities/impurities.routes').then(r => r.IMPURITIES_ROUTES)
  },
  {
    path: '',
    loadChildren: () => import('./invitro-pharmacology/invitro-pharmacology.routes').then(r => r.INVITRO_PHARMACOLOGY_ROUTES)
  },
  {
    path: 'sub-app-match-list/:id',
    loadComponent: () => import('./substance-browse/substance-application-match-list/substance-application-match-list.component').then(c => c.SubstanceApplicationMatchListComponent)
  },
  {
    path: 'user-manual',
    loadComponent: () => import('./user-manual/user-manual.component').then(c => c.UserManualComponent)
  },
  {
    path: 'jira-submit',
    loadComponent: () => import('./jira-submit-ticket/jira-submit-ticket.component').then(c => c.JiraSubmitTicketComponent)
  },
  {
    path: '',
    loadChildren: () => import('./product/product.routes').then(r => r.PRODUCT_ROUTES)
  },
  {
    path: '',
    loadChildren: () => import('./advanced-search/advanced-search.routes').then(r => r.ADVANCED_SEARCH_ROUTES)
  }
]