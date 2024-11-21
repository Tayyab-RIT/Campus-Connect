import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingLayoutComponent } from './layouts/landing-layout/landing-layout.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { RegisterComponent } from './pages/register/register.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { authGuard } from './auth.guard';
import { authRedirectGuard } from './auth-redirect.guard';
import { PublicPortfolioComponent } from './public-portfolio/public-portfolio.component';
import { FeedComponent } from './pages/feed/feed.component';

const routes: Routes = [
  { path: 'profile/:username', component: PublicPortfolioComponent }, // Dynamic route
  {
    path: '',
    component: LandingLayoutComponent,
    children: [
      { path: '', component: LandingPageComponent },
      {
        path: 'sign-in',
        component: SignInComponent,
        canActivate: [authRedirectGuard],
      },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [authRedirectGuard],
      },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'feed/:page',
        component: FeedComponent,
        canActivate: [authGuard],
      },
      { path: 'home', component: HomeComponent, canActivate: [authGuard] },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard],
      },
    ],
  },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
