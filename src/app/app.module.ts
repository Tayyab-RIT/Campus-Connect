import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingLayoutComponent } from './layouts/landing-layout/landing-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { RegisterComponent } from './pages/register/register.component';
import { MainNavBarComponent } from './components/main-nav-bar/main-nav-bar.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LandingPageNavBarComponent } from './components/landing-page-nav-bar/landing-page-nav-bar.component';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PublicPortfolioComponent } from './public-portfolio/public-portfolio.component';
import { FeedComponent } from './pages/feed/feed.component';
import { TutoringComponent } from './pages/tutoring/tutoring.component';
import { ServicesComponent } from './pages/services/services.component';
import { ProfessorsComponent } from './pages/professors/professors.component';
import { QrCodeModule } from 'ng-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    LandingLayoutComponent,
    MainLayoutComponent,
    HomeComponent,
    LandingPageComponent,
    SignInComponent,
    RegisterComponent,
    MainNavBarComponent,
    ProfileComponent,
    LandingPageNavBarComponent,
    PublicPortfolioComponent,
    FeedComponent,
    TutoringComponent,
    ServicesComponent,
    ProfessorsComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, QrCodeModule],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule {}
