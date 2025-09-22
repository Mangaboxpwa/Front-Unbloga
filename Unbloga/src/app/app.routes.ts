import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',   loadComponent: () => import('./home/home.component').then(m => m.HomeComponent), children: [
            { path: '', loadComponent: () => import('./principal/principal.component').then(m => m.PrincipalComponent) },
            { path: 'manga', loadComponent: () => import('./manga/manga.component').then(m => m.MangaComponent) },
            
            
            
        ]
    }
];
