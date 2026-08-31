import {Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {MainComponent} from "./components/main/main.component";
import {RegisterComponent} from "./components/register/register.component";
import {GivingServicesComponent} from "./components/giving-services/giving-services.component";
import {GivingServiceDetailComponent} from "./components/giving-service-detail/giving-service-detail.component";
import {HowItWorksComponent} from "./components/how-it-works/how-it-works.component";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component";

export const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'how-it-works',
    component: HowItWorksComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },

  {
    path: 'reset-password',
    component: ResetPasswordComponent
  },

  {
    path: 'home',
    component: MainComponent
  },
  {
    path: 'giving-services',
    component: GivingServicesComponent
  },

  {
    path: 'giving-services/:id',
    component: GivingServiceDetailComponent
  },
];
