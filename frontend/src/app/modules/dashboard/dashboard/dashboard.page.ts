import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Api } from '../../../core/services/api';
import {
  AccessLog,
  CountByDate,
  CountByName,
  CountByStatus,
  Resident,
  Vehicle,
} from '../../../core/models';

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
  last7Days: CountByDate[] = [];
  recent: AccessLog[] = [];
  loading = true;
  maxCount = 0;
  residents: Resident[] = [];
  vehicles: Vehicle[] = [];

  constructor(private api: Api) {}

  ngOnInit() {
    this.loadData();
    this.loadSelects();
  }

  loadSelects() {
    this.api
      .getResidents('', 1, 200)
      .subscribe((res) => (this.residents = res.data));
    this.api
      .getVehicles('', 1, 200)
      .subscribe((res) => (this.vehicles = res.data));
  }

  loadData(): void {
    this.loading = true;
    forkJoin({
      residents: this.api.getResidentStatusCounts(),
      visitors: this.api.getVisitorStatusCounts(),
      access: this.api.getAccessStatusCounts(),
      last7: this.api.getAccessLast7Days(),
      recent: this.api.getRecentAccessLogs(6),
    }).subscribe({
      next: (data) => {
        this.residentCounts = data.residents;
        this.visitorCounts = data.visitors;
        this.accessCounts = data.access;
        this.last7Days = data.last7;
        this.recent = data.recent;
        this.maxCount = Math.max(...data.last7.map((d) => d.count), 1);
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

  getResidentName(id: number | null): string {
    const resident = this.residents.find((r) => r.id === id);
    return resident ? resident.name : 'N/A';
  }

  getVehiclePlate(id: number | null): string {
    const vehicle = this.vehicles.find((v) => v.id === id);
    return vehicle ? vehicle.plate : 'N/A';
  }
}
