import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Api } from '../../../core/services/api';
import { AccessLog, CountByDate, CountByName, CountByStatus } from '../../../core/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {
  residentCounts: CountByStatus[] = [];
  visitorCounts: CountByStatus[] = [];
  accessCounts: CountByStatus[] = [];
  vehicleCounts: CountByName[] = [];
  last7Days: CountByDate[] = [];
  recent: AccessLog[] = [];
  loading = true;

  constructor(private api: Api) { }

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.loading = true;
    forkJoin({
      residents: this.api.getResidentStatusCounts(),
      visitors: this.api.getVisitorStatusCounts(),
      access: this.api.getAccessStatusCounts(),
      vehicles: this.api.getVehiclesPerResident(),
      last7: this.api.getAccessLast7Days(),
      recent: this.api.getRecentAccessLogs(6),
    }).subscribe({
      next: (data) => {
        this.residentCounts = data.residents;
        this.visitorCounts = data.visitors;
        this.accessCounts = data.access;
        this.vehicleCounts = data.vehicles;
        this.last7Days = data.last7;
        this.recent = data.recent;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  total(items: { count: number }[]): number {
    return items.reduce((sum, item) => sum + item.count, 0);
  }
}
