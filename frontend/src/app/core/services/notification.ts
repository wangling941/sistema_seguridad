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
  private readonly maxReconnectAttempts = 5;
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
        // Si es un evento de ping o conexión, ignorarlo
        if (parsed.type === 'CONNECTED' || parsed.type === 'ping') {
          console.log('📡 Evento de mantenimiento recibido:', parsed.type);
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
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * this.reconnectAttempts;
      console.log(
        `🔄 Reintentando conexión en ${delay}ms (intento ${this.reconnectAttempts})`,
      );
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = setTimeout(() => this.connect(), delay);
    } else {
      console.error('❌ Máximo de intentos de reconexión alcanzado');
    }
  }

  disconnect(): void {
    this.source?.close();
    this.source = undefined;
    this.isConnected = false;
    clearTimeout(this.reconnectTimeout);
    console.log('🔌 EventSource desconectado');
  }

  clear(): void {
    this.notificationsSubject.next([]);
    console.log('🧹 Notificaciones limpiadas');
  }
}
