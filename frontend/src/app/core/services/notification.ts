import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RealtimeNotification } from '../models';

@Injectable({
  providedIn: 'root',
})
export class Notification {
  private source?: EventSource;
  private readonly notificationsSubject = new BehaviorSubject<RealtimeNotification[]>([]);

  readonly notifications$ = this.notificationsSubject.asObservable();

  connect(): void {
    if (this.source) {
      return;
    }

    this.source = new EventSource(environment.eventsUrl);
    this.source.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      const notification: RealtimeNotification = {
        type: parsed.type || 'EVENT',
        payload: parsed.payload,
        receivedAt: new Date().toISOString(),
      };
      this.notificationsSubject.next([notification, ...this.notificationsSubject.value].slice(0, 50));
    };
  }

  disconnect(): void {
    this.source?.close();
    this.source = undefined;
  }

  clear(): void {
    this.notificationsSubject.next([]);
  }
}
