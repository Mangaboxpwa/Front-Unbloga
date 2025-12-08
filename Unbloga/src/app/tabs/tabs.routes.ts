import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
  {
    path: 'manga/:id',
    loadComponent: () =>
      import('../manga/manga.page').then((m) => m.MangaPage),
  },
  {
    path: 'review/:id',
    loadComponent: () =>
      import('../review/review.page').then((m) => m.ReviewPage),
  },
  {
    path: 'network/:id',
    loadComponent: () => import('../pages/network/network.page').then( m => m.NetworkPage)
  },
  {
    path: 'network',
    loadComponent: () => import('../pages/network/network.page').then( m => m.NetworkPage)
  },
  {
    path: 'user-profile/:id',
    loadComponent: () => import('../pages/user-profile/user-profile.page').then( m => m.UserProfilePage)
  },
  {
    path: 'favorites/:id',
    loadComponent: () => import('../pages/favorites/favorites.page').then( m => m.FavoritesPage)
  },
  {
    path: 'favorites',
    loadComponent: () => import('../pages/favorites/favorites.page').then( m => m.FavoritesPage)
  },
  {
    path: 'reviews/:id',
    loadComponent: () => import('../pages/reviews/reviews.page').then( m => m.ReviewsPage)
  },
  {
    path: 'reviews',
    loadComponent: () => import('../pages/reviews/reviews.page').then( m => m.ReviewsPage)
  },
  {
    path: 'qr-code/:id',
    loadComponent: () => import('../pages/qr-code/qr-code.page').then( m => m.QrCodePage)
  },
  {
    path: 'proposal',
    loadComponent: () => import('../pages/proposal/proposal.page').then( m => m.ProposalPage)
  },
      {
        path: '',
        redirectTo: '/tab1',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tab1',
    pathMatch: 'full',
  },
];
