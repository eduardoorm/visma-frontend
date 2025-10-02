import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/divisions',
    pathMatch: 'full'
  },
  {
    path: 'divisions',
    loadComponent: () => import('./features/divisions/divisions.component').then(m => m.DivisionsComponent)
  },
  {
    path: '**',
    redirectTo: '/divisions'
  }
];
