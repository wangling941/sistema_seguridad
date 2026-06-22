import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RealtimeNotification } from '../../../core/models';
import { Notification } from '../../../core/services/notification';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  standalone: false,
})
export class NotificationsPage implements OnInit {
  notifications$!: Observable<RealtimeNotification[]>;

  constructor(private notificationService: Notification) { }

  ngOnInit() {
    this.notifications$ = this.notificationService.notifications$;
    this.notificationService.connect();
  }

  clear(): void {
    this.notificationService.clear();
  }
}
