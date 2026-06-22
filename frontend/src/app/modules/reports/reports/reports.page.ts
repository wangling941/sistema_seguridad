import { Component, OnInit } from '@angular/core';
import { AccessLog, Resident, Vehicle, Visitor } from '../../../core/models';
import { Api } from '../../../core/services/api';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: false,
})
export class ReportsPage implements OnInit {
  logs: AccessLog[] = [];
  total = 0;
  residents: Resident[] = [];
  vehicles: Vehicle[] = [];
  visitors: Visitor[] = [];

  filters = {
    startDate: '',
    endDate: '',
    residentId: null as number | null,
    vehiclePlate: '',
  };

  constructor(private api: Api) {}

  ngOnInit() {
    this.loadSelects();
    this.load();
  }

  loadSelects() {
    this.api
      .getResidents('', 1, 200)
      .subscribe((res) => (this.residents = res.data));
    this.api
      .getVehicles('', 1, 200)
      .subscribe((res) => (this.vehicles = res.data));
    this.api
      .getVisitors('', 1, 200)
      .subscribe((res) => (this.visitors = res.data));
  }

  load(): void {
    const params: any = { page: 1, limit: 100 };
    if (this.filters.startDate) params.startDate = this.filters.startDate;
    if (this.filters.endDate) params.endDate = this.filters.endDate;
    if (this.filters.residentId) params.residentId = this.filters.residentId;
    if (this.filters.vehiclePlate)
      params.vehiclePlate = this.filters.vehiclePlate;

    this.api.getReport(params).subscribe({
      next: (result) => {
        this.logs = result.data || [];
        this.total = result.total || 0;
      },
      error: () => {
        this.logs = [];
        this.total = 0;
      },
    });
  }

  clear(): void {
    this.filters = {
      startDate: '',
      endDate: '',
      residentId: null,
      vehiclePlate: '',
    };
    this.load();
  }

  getResidentName(id: number | null): string {
    const resident = this.residents.find((r) => r.id === id);
    return resident ? resident.name : 'Sin residente';
  }

  getVehiclePlate(id: number | null): string {
    const vehicle = this.vehicles.find((v) => v.id === id);
    return vehicle ? vehicle.plate : 'Sin vehículo';
  }

  getVisitorName(id: number | null): string {
    const visitor = this.visitors.find((v) => v.id === id);
    return visitor ? visitor.name : 'Sin visitante';
  }
}
