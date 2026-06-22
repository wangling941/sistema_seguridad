import { Component, OnInit } from '@angular/core';
import { AccessLog } from '../../../core/models';
import { Api } from '../../../core/services/api';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: false,
})
export class ReportsPage implements OnInit {
  logs: AccessLog[] = []; // inicializado vacío
  total = 0;
  filters = {
    startDate: '',
    endDate: '',
    residentId: null as number | null,
    vehiclePlate: '',
  };

  constructor(private api: Api) {}

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.api.getReport({ ...this.filters, page: 1, limit: 100 }).subscribe({
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
}
