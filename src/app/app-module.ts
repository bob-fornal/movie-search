import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { LandingPage } from './pages/landing-page/landing-page';

@NgModule({
  declarations: [
    App,
    LandingPage,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
