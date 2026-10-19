
import { Routes } from '@angular/router';

import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { Overview } from './features/dashboard/overview/overview';
import { authGuard } from './core/guards/auth-guard-guard';
import { roleGuard } from './core/guards/role-guard-guard';



export const routes: Routes = [
  // =========================
  // Public Routes
  // =========================
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },

  {
    path: '403',
    loadComponent: () =>
      import('./features/forbidden/forbidden')
        .then(m => m.Forbidden)
  },

  // =========================
  // Protected Admin Layout
  // =========================
  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      // =========================
      // Dashboard
      // All Roles
      // =========================
      {
        path: 'dashboard',
        component: Overview,
        canActivate: [roleGuard],
        data: {
          roles: ['Admin', 'Manager', 'Employee']
        }
      },

      // =========================
      // Users
      // Admin Only
      // =========================
      {
        path: 'users',
        canActivate: [roleGuard],
        data: {
          roles: ['Admin']
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/users/users-list/users-list')
                .then(m => m.UsersList)
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/users/user-form/user-form')
                .then(m => m.UserForm)
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/users/user-form/user-form')
                .then(m => m.UserForm)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/users/user-details/user-details')
                .then(m => m.UserDetails)
          }
        ]
      },

      // =========================
      // Products
      // Admin + Manager
      // =========================
      {
        path: 'products',
        canActivate: [roleGuard],
        data: {
          roles: ['Admin', 'Manager']
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/products/products-list/products-list')
                .then(m => m.ProductsList)
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./features/products/product-form/product-form')
                .then(m => m.ProductForm)
          },
          {
            path: ':id/edit',
            loadComponent: () =>
              import('./features/products/product-form/product-form')
                .then(m => m.ProductForm)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/products/product-details/product-details')
                .then(m => m.ProductDetails)
          }
        ]
      },

      // =========================
      // Orders
      // All Roles
      // =========================
      {
        path: 'orders',
        canActivate: [roleGuard],
        data: {
          roles: ['Admin', 'Manager', 'Employee']
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./features/orders/orders-list/orders-list')
                .then(m => m.OrdersList)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./features/orders/order-details/order-details')
                .then(m => m.OrderDetails)
          }
        ]
      },

      // =========================
      // Settings
      // Admin Only
      // =========================
      {
        path: 'settings',
        canActivate: [roleGuard],
        data: {
          roles: ['Admin']
        },
        loadComponent: () =>
          import('./features/settings/settings')
            .then(m => m.Settings)
      }
    ]
  },

  // =========================
  // Unknown Routes
  // =========================
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
