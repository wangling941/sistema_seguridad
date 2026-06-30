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
  Visitor,
} from '../../../core/models';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage implements OnInit {
  // Métricas
  residentCounts: CountByStatus[] = [];
  visitorCounts: CountByStatus[] = [];
  accessCounts: CountByStatus[] = [];
  totalVehicles = 0;
  totalAccesses = 0;

  // Gráficos
  last7Days: CountByDate[] = [];
  recent: AccessLog[] = [];
  loading = true;
  maxCount = 0;

  // Selectores para nombres
  residents: Resident[] = [];
  vehicles: Vehicle[] = [];
  visitors: Visitor[] = [];

  // Chart.js instancias
  private chartBar: Chart | null = null;
  private chartPie: Chart | null = null;

  constructor(private api: Api) {}

  ngOnInit() {
    this.loadData();
    this.loadSelects();
  }

  loadSelects() {
    forkJoin({
      residents: this.api.getResidents('', 1, 200),
      vehicles: this.api.getVehicles('', 1, 200),
      visitors: this.api.getVisitors('', 1, 200),
    }).subscribe({
      next: (res) => {
        this.residents = res.residents.data;
        this.vehicles = res.vehicles.data;
        this.visitors = res.visitors.data;
        this.totalVehicles = res.vehicles.total;
      },
      error: () => {},
    });
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
        this.totalAccesses = data.access.reduce(
          (sum, item) => sum + item.count,
          0,
        );
        this.maxCount = Math.max(...data.last7.map((d) => d.count), 1);
        this.loading = false;

        // Renderizar gráficos después de obtener datos
        setTimeout(() => {
          this.renderCharts();
        }, 200);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  renderCharts() {
    // Gráfico de barras: accesos últimos 7 días
    const barCtx = document.getElementById('barChart') as HTMLCanvasElement;
    if (barCtx) {
      if (this.chartBar) this.chartBar.destroy();
      this.chartBar = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: this.last7Days.map((d) =>
            new Date(d.date).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
            }),
          ),
          datasets: [
            {
              label: 'Accesos',
              data: this.last7Days.map((d) => d.count),
              backgroundColor: 'rgba(15, 118, 110, 0.7)',
              borderColor: '#0f766e',
              borderWidth: 2,
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 },
            },
          },
        },
      });
    }

    // Gráfico de torta: distribución de accesos por tipo (de los últimos 7 días)
    const pieCtx = document.getElementById('pieChart') as HTMLCanvasElement;
    if (pieCtx) {
      if (this.chartPie) this.chartPie.destroy();
      // Contar accesos por tipo (residente, vehículo, visitante) desde los últimos accesos
      const residentAccess = this.recent.filter(
        (a) => a.residentId !== null,
      ).length;
      const vehicleAccess = this.recent.filter(
        (a) => a.vehicleId !== null,
      ).length;
      const visitorAccess = this.recent.filter(
        (a) => a.visitorId !== null,
      ).length;
      const total = residentAccess + vehicleAccess + visitorAccess || 1;

      this.chartPie = new Chart(pieCtx, {
        type: 'pie',
        data: {
          labels: ['Residente', 'Vehículo', 'Visitante'],
          datasets: [
            {
              data: [residentAccess, vehicleAccess, visitorAccess],
              backgroundColor: ['#0f766e', '#3b82f6', '#f59e0b'],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 12, font: { size: 10 } },
            },
          },
        },
      });
    }
  }

  // Utilitarios
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

  getVisitorName(id: number | null): string {
    const visitor = this.visitors.find((v) => v.id === id);
    return visitor ? visitor.name : 'N/A';
  }

  // Método para refrescar
  refresh() {
    this.loadData();
    this.loadSelects();
  }
}
