import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {MainComponent} from "./components/main/main.component";
import {RegisterComponent} from "./components/register/register.component";
import {GivingServicesComponent} from "./components/giving-services/giving-services.component";
import {GivingServiceDetailComponent} from "./components/giving-service-detail/giving-service-detail.component";

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
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'home',
    component: MainComponent
  },
  {
    path: 'giving-services',
    component: GivingServicesComponent
  },

  { path: 'giving-services/:id',
    component: GivingServiceDetailComponent },
];
