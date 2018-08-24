import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CoreComponent } from './core/core.component';
import { HomeComponent } from './home/home.component';
import { BrowseSubstanceComponent } from './browse-substance/browse-substance.component';
import { TestComponent } from './testing-directory/test/test.component';
import { configServiceFactory } from './config/config.factory';
import { ConfigService } from './config/config.service'; 

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    CoreComponent,
    HomeComponent,
    BrowseSubstanceComponent,
    TestComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'gsrs' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCardModule,
    HttpClientModule
  ],
  providers: [
    ConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: configServiceFactory,
            deps: [ConfigService],
            multi: true
        }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
