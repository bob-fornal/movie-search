import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingPage } from './pages/landing-page/landing-page';

const routes: Routes = [
  { path: '', component: LandingPage },
  { path: '**', component: LandingPage },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
