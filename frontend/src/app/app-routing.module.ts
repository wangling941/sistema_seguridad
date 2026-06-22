import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./modules/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./modules/dashboard/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'residents',
    loadChildren: () => import('./modules/residents/residents/residents.module').then( m => m.ResidentsPageModule)
  },
  {
    path: 'vehicles',
    loadChildren: () => import('./modules/vehicles/vehicles/vehicles.module').then( m => m.VehiclesPageModule)
  },
  {
    path: 'visitors',
    loadChildren: () => import('./modules/visitors/visitors/visitors.module').then( m => m.VisitorsPageModule)
  },
  {
    path: 'access',
    loadChildren: () => import('./modules/access/access/access.module').then( m => m.AccessPageModule)
  },
  {
    path: 'reports',
    loadChildren: () => import('./modules/reports/reports/reports.module').then( m => m.ReportsPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./modules/notifications/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
