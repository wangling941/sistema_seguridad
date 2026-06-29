// src/app/core/models/realtime-notification.model.ts
export interface RealtimeNotification {
  id: string; // Obligatorio
  type: string;
  payload: any;
  receivedAt: string; // ISO string
  read: boolean;
}
