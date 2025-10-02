import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'manga',
    loadComponent: () =>
      import('./manga/manga.page').then((m) => m.MangaPage),
  },
  {
    path: 'review',
    loadComponent: () =>
      import('./review/review.page').then((m) => m.ReviewPage),
  },
];
