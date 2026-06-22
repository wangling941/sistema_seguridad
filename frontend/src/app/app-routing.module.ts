import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

const routes: Routes = [
  {
    path: 'home',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/auth/login/login.module').then(
        (m) => m.LoginPageModule,
      ),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/dashboard/dashboard/dashboard.module').then(
        (m) => m.DashboardPageModule,
      ),
  },
  {
    path: 'residents',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/residents/residents/residents.module').then(
        (m) => m.ResidentsPageModule,
      ),
  },
  {
    path: 'vehicles',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/vehicles/vehicles/vehicles.module').then(
        (m) => m.VehiclesPageModule,
      ),
  },
  {
    path: 'visitors',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/visitors/visitors/visitors.module').then(
        (m) => m.VisitorsPageModule,
      ),
  },
  {
    path: 'access',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/access/access/access.module').then(
        (m) => m.AccessPageModule,
      ),
  },
  {
    path: 'reports',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/reports/reports/reports.module').then(
        (m) => m.ReportsPageModule,
      ),
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/notifications/notifications/notifications.module').then(
        (m) => m.NotificationsPageModule,
      ),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./modules/auth/register/register.module').then(
        (m) => m.RegisterPageModule,
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
