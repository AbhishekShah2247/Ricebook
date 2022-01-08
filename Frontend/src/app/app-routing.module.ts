import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppGuard } from './app.guard';
import { AuthComponent } from './auth/auth.component';
import { GoogleRedirectComponent } from './auth/google-redirect/google-redirect.component';
import { MainComponent } from './main/main.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'loginWithGoogle/:id', component: GoogleRedirectComponent},
  { path: 'posts', component: MainComponent, canActivate: [AppGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AppGuard] },
  { path: '**', component: MainComponent, canActivate: [AppGuard] },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
