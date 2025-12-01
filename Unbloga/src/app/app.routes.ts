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
    path: 'manga/:id',
    loadComponent: () =>
      import('./manga/manga.page').then((m) => m.MangaPage),
  },
  {
    path: 'review/:id',
    loadComponent: () =>
      import('./review/review.page').then((m) => m.ReviewPage),
  },
  {
    path: 'two-factor',
    loadComponent: () => import('./pages/two-factor/two-factor.page').then( m => m.TwoFactorPage)
  },
  {
    path: 'send-email',
    loadComponent: () => import('./pages/send-email/send-email.page').then( m => m.SendEmailPage)
  },
  {
    path: 'recovery-code',
    loadComponent: () => import('./pages/recovery-code/recovery-code.page').then( m => m.RecoveryCodePage)
  },
  {
    path: 'new-pass',
    loadComponent: () => import('./pages/new-pass/new-pass.page').then( m => m.NewPassPage)
  },
  {
    path: 'network/:id',
    loadComponent: () => import('./pages/network/network.page').then( m => m.NetworkPage)
  },
  {
    path: 'network',
    loadComponent: () => import('./pages/network/network.page').then( m => m.NetworkPage)
  },
  {
    path: 'user-profile/:id',
    loadComponent: () => import('./pages/user-profile/user-profile.page').then( m => m.UserProfilePage)
  },
];
