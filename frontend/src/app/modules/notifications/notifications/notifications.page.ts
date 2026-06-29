import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Notification } from '../../../core/services/notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false,
})
export class NotificationsPage implements OnInit, OnDestroy {
  notifications: any[] = [];
  filteredNotifications: any[] = [];

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  filterType: string = 'all';
  showOnlyUnread = false;

  loading = true;
  isConnected = false;
  unreadCount = 0;
  total = 0;

  private subscription?: Subscription;

  constructor(private notificationService: Notification) {}

  ngOnInit() {
    this.loading = true;
    // Conectar solo si no está conectado
    if (!this.notificationService.isConnected) {
      this.notificationService.connect();
    }

    this.subscription = this.notificationService.notifications$.subscribe({
      next: (items) => {
        const newItems = items.map((item) => ({
          ...item,
          id:
            (item as any).id ||
            `notif_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          read: (item as any).read ?? false,
          receivedAt: (item as any).receivedAt || new Date().toISOString(),
        }));
        this.notifications = newItems;
        this.total = this.notifications.length;
        this.unreadCount = this.notifications.filter(
          (n: any) => !n.read,
        ).length;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });

    this.isConnected = this.notificationService.isConnected;
  }

  ngOnDestroy() {
    // ✅ NO desconectar SSE al salir del componente
    // Solo limpiar la suscripción
    this.subscription?.unsubscribe();
    console.log('🧹 Componente NotificationsPage destruido, SSE sigue activo');
  }

  // ... resto de métodos iguales
  applyFilters() {
    let filtered = [...this.notifications];

    if (this.filterType !== 'all') {
      filtered = filtered.filter((n: any) => n.type === this.filterType);
    }

    if (this.showOnlyUnread) {
      filtered = filtered.filter((n: any) => !n.read);
    }

    filtered.sort((a: any, b: any) => {
      return (
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
      );
    });

    this.filteredNotifications = filtered;
    this.totalPages = Math.max(
      1,
      Math.ceil(this.filteredNotifications.length / this.pageSize),
    );

    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  toggleReadFilter() {
    this.showOnlyUnread = !this.showOnlyUnread;
    this.currentPage = 1;
    this.applyFilters();
  }

  clearFilters() {
    this.filterType = 'all';
    this.showOnlyUnread = false;
    this.currentPage = 1;
    this.applyFilters();
  }

  markAsRead(item: any) {
    item.read = true;
    this.unreadCount = this.notifications.filter((n: any) => !n.read).length;
    this.applyFilters();
  }

  markAllAsRead() {
    this.notifications.forEach((n: any) => (n.read = true));
    this.unreadCount = 0;
    this.applyFilters();
  }

  clear() {
    this.notificationService.clear();
  }

  getEventLabel(type: string): string {
    const labels: { [key: string]: string } = {
      ACCESS_CREATED: 'Nuevo acceso',
      VEHICLE_CREATED: 'Vehículo registrado',
      RESIDENT_CREATED: 'Residente registrado',
    };
    return labels[type] || type.replace('_', ' ');
  }

  getMessage(item: any): string {
    const { type, payload } = item;
    const p = payload as any;

    switch (type) {
      case 'ACCESS_CREATED':
        const entryTime = p.entryDatetime
          ? new Date(p.entryDatetime).toLocaleString()
          : 'hace un momento';
        return `Nuevo acceso registrado a las ${entryTime}`;
      case 'VEHICLE_CREATED':
        return `Vehículo con placa ${p.plate || 'N/A'} registrado`;
      case 'RESIDENT_CREATED':
        return `Residente ${p.name || 'Nuevo'} registrado en el sistema`;
      default:
        return JSON.stringify(p);
    }
  }

  get pagedNotifications(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredNotifications.slice(start, end);
  }
}
