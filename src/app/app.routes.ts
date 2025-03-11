import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { loadGuard } from './core/guards/load.guard';


export const routes: Routes = [

  // Public Routes
  {
    path: 'login',
    loadComponent: () =>
      import('./shared/pages/login/login.component').then(c => c.LoginComponent),
    canActivate: [loadGuard]
  },

  // Protected Routes
  {
    path: '',
    loadComponent: () =>
      import('./shared/layout/layout.component').then(c => c.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/todos-table/todos-table.component').then(c => c.TodosTableComponent)
      },
    ],
  },

  // Fallback Routes
  {
    path: '**',
    redirectTo: 'not-found'
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./shared/pages/not-found/not-found.component').then(c => c.NotFoundComponent)
  },
];
