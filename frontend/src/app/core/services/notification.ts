import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RealtimeNotification } from '../models';

@Injectable({
  providedIn: 'root',
})
export class Notification {
  private source?: EventSource;
  private readonly notificationsSubject = new BehaviorSubject<
    RealtimeNotification[]
  >([]);
  readonly notifications$ = this.notificationsSubject.asObservable();

  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 10;
  private reconnectTimeout?: any;
  private reconnectDelay = 3000;

  isConnected = false;

  connect(): void {
    if (this.source) {
      console.log('🔌 EventSource ya conectado');
      return;
    }

    console.log(`🔄 Conectando a EventSource: ${environment.eventsUrl}`);
    try {
      this.source = new EventSource(environment.eventsUrl);
    } catch (error) {
      console.error('❌ Error al crear EventSource:', error);
      this.scheduleReconnect();
      return;
    }

    this.source.onopen = () => {
      console.log('✅ EventSource conectado');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    };

    this.source.onmessage = (event) => {
      console.log('📩 Evento SSE recibido (raw):', event.data);
      try {
        const parsed = JSON.parse(event.data);
        console.log('🔍 Evento parseado:', parsed);
        // Ignorar pings
        if (
          event.data.startsWith(':') ||
          parsed.type === 'ping' ||
          parsed.type === 'connected'
        ) {
          return;
        }
        const notification = {
          id:
            parsed.id ||
            `notif_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          type: parsed.type || 'EVENT',
          payload: parsed.payload || {},
          receivedAt: parsed.receivedAt
            ? new Date(parsed.receivedAt).toISOString()
            : new Date().toISOString(),
          read: false,
        } as RealtimeNotification;

        const current = this.notificationsSubject.value;
        this.notificationsSubject.next([notification, ...current].slice(0, 50));
        console.log(
          '✅ Notificación agregada, total:',
          this.notificationsSubject.value.length,
        );
      } catch (e) {
        console.error('❌ Error parseando evento SSE:', e);
      }
    };

    this.source.onerror = (event) => {
      console.error('❌ Error en EventSource:', event);
      this.source?.close();
      this.source = undefined;
      this.isConnected = false;
      // Solo reconectar si no es un error de red grave
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      }
    };
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.min(this.reconnectAttempts, 5);
    console.log(
      `🔄 Reintentando conexión en ${delay}ms (intento ${this.reconnectAttempts})`,
    );
    clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(() => this.connect(), delay);
  }

  disconnect(): void {
    this.source?.close();
    this.source = undefined;
    this.isConnected = false;
    clearTimeout(this.reconnectTimeout);
    console.log('🔌 EventSource desconectado');
    // Resetear intentos para futuras reconexiones
    this.reconnectAttempts = 0;
  }

  clear(): void {
    this.notificationsSubject.next([]);
    console.log('🧹 Notificaciones limpiadas');
  }
}
