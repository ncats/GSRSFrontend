import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CoreComponent } from './core/core.component';
import { HomeComponent } from './home/home.component';
import { SubstancesBrowseComponent } from './substances-browse/substances-browse.component';
import { StructureSearchComponent } from './structure-search/structure-search.component';
import { SubstanceDetailsComponent } from './substance-details/substance-details.component';
import { environment } from '../environments/environment';
import { FdaSampleComponent } from './fda-sample/fda-sample.component';

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
  }
];

const routes: Routes = [
  {
    path: '',
    children: childRoutes,
    component: CoreComponent
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
