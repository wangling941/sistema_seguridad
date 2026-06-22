import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from './core/services/auth';
import { Notification } from './core/services/notification';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  readonly pages = [
    { title: 'Panel', url: '/dashboard', icon: 'grid-outline' },
    { title: 'Residentes', url: '/residents', icon: 'people-outline' },
    { title: 'Vehiculos', url: '/vehicles', icon: 'car-outline' },
    { title: 'Visitantes', url: '/visitors', icon: 'person-add-outline' },
    { title: 'Accesos', url: '/access', icon: 'log-in-outline' },
    { title: 'Reportes', url: '/reports', icon: 'bar-chart-outline' },
    { title: 'Notificaciones', url: '/notifications', icon: 'notifications-outline' },
  ];

  constructor(
    public auth: Auth,
    private router: Router,
    private notifications: Notification,
  ) {
    if (this.auth.isAuthenticated()) {
      this.notifications.connect();
    }
  }

  logout(): void {
    this.notifications.disconnect();
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
