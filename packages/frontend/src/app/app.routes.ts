import { Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {MainComponent} from "./components/main/main.component";
import {RegisterComponent} from "./components/register/register.component"; // Твојата домашна компонента

export const routes: Routes = [
  // Кога апликацијата ќе се отвори прв пат (http://localhost:4200/), те носи на логин
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Страна за најава
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
  }
];
