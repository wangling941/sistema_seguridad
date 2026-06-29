import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AccessLog, Resident, Vehicle, Visitor } from '../../../core/models';
import { Api } from '../../../core/services/api';
import { Auth } from '../../../core/services/auth';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { finalize } from 'rxjs';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
  standalone: false,
})
export class ReportsPage implements OnInit, AfterViewInit {
  @ViewChild('dayChart') dayChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('residentChart') residentChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('hourChart') hourChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('visitorChart') visitorChartRef!: ElementRef<HTMLCanvasElement>;

  logs: AccessLog[] = [];
  total = 0;
  residents: Resident[] = [];
  vehicles: Vehicle[] = [];
  visitors: Visitor[] = [];
  perDay: any[] = [];
  perResident: any[] = [];
  perHour: any[] = [];
  topVisitors: any[] = [];

  filters = {
    startDate: '',
    endDate: '',
    residentId: null as number | null,
    vehiclePlate: '',
  };

  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  loading = false;
  loadError = '';
  dateError = '';

  todayAccesses = 0;
  pendingAccesses = 0;
  vehiclesUsed = 0;

  private dayChart: Chart | null = null;
  private residentChart: Chart | null = null;
  private hourChart: Chart | null = null;
  private visitorChart: Chart | null = null;
  private searchTimeout: any;

  constructor(
    private api: Api,
    private auth: Auth,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.loadSelects();
    this.load();
  }

  ngAfterViewInit() {
    // Los gráficos se renderizan cuando llegan los datos
  }

  loadSelects() {
    this.api.getResidents('', 1, 200).subscribe((res) => {
      this.residents = res.data;
    });
    this.api.getVehicles('', 1, 200).subscribe((res) => {
      this.vehicles = res.data;
    });
    this.api.getVisitors('', 1, 200).subscribe((res) => {
      this.visitors = res.data;
    });
  }

  load() {
    if (this.filters.startDate && this.filters.endDate) {
      const start = new Date(this.filters.startDate);
      const end = new Date(this.filters.endDate);
      if (start > end) {
        this.dateError = 'La fecha "Desde" no puede ser posterior a "Hasta"';
        return;
      } else {
        this.dateError = '';
      }
    } else {
      this.dateError = '';
    }

    this.loading = true;
    this.loadError = '';
    const params: any = {
      page: this.currentPage,
      limit: this.pageSize,
    };
    if (this.filters.startDate) params.startDate = this.filters.startDate;
    if (this.filters.endDate) params.endDate = this.filters.endDate;
    if (this.filters.residentId) params.residentId = this.filters.residentId;
    if (this.filters.vehiclePlate)
      params.vehiclePlate = this.filters.vehiclePlate;

    this.api.getReport(params).subscribe({
      next: (result: any) => {
        this.logs = result.logs?.data || [];
        this.total = result.logs?.total || 0;
        this.perDay = result.perDay || [];
        this.perResident = result.perResident || [];

        this.calculateExtraCharts();

        this.totalPages = Math.ceil(this.total / this.pageSize);
        if (this.currentPage > this.totalPages) {
          this.currentPage = 1;
          this.load();
          return;
        }

        this.calculateSummary();

        setTimeout(() => {
          this.renderCharts();
        }, 200);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error en reportes:', err);
        this.loadError = 'No se pudieron cargar los datos. Intenta nuevamente.';
        this.loading = false;
      },
    });
  }

  calculateExtraCharts() {
    const hourMap = new Map<number, number>();
    for (let i = 0; i < 24; i++) hourMap.set(i, 0);
    this.logs.forEach((log) => {
      const hour = new Date(log.entryDatetime).getHours();
      hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
    });
    this.perHour = Array.from(hourMap.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour - b.hour);

    const visitorMap = new Map<string, number>();
    this.logs.forEach((log) => {
      const name = this.getVisitorName(log.visitorId);
      if (name !== 'Sin visitante') {
        visitorMap.set(name, (visitorMap.get(name) || 0) + 1);
      }
    });
    this.topVisitors = Array.from(visitorMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  calculateSummary() {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    this.todayAccesses = this.logs.filter((log) => {
      const entryDate = new Date(log.entryDatetime).toISOString().split('T')[0];
      return entryDate === todayStr;
    }).length;
    this.pendingAccesses = this.logs.filter((log) => !log.exitDatetime).length;
    const uniqueVehicles = new Set(
      this.logs.map((log) => log.vehicleId).filter((id) => id !== null),
    );
    this.vehiclesUsed = uniqueVehicles.size;
  }

  renderCharts() {
    // 1. Accesos por día
    if (this.perDay.length > 0 && this.dayChartRef) {
      if (this.dayChart) this.dayChart.destroy();
      const ctx = this.dayChartRef.nativeElement.getContext('2d');
      if (!ctx) return;
      this.dayChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.perDay.map((item) => item.date || item.day || ''),
          datasets: [
            {
              label: 'Accesos',
              data: this.perDay.map((item) => item.count || item.total || 0),
              backgroundColor: 'rgba(15, 118, 110, 0.6)',
              borderColor: '#0f766e',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
            x: { ticks: { maxRotation: 45, minRotation: 0 } },
          },
        },
      });
    }

    // 2. Accesos por residente
    if (this.perResident.length > 0 && this.residentChartRef) {
      if (this.residentChart) this.residentChart.destroy();
      const ctx = this.residentChartRef.nativeElement.getContext('2d');
      if (!ctx) return;
      const top = this.perResident.slice(0, 10);
      this.residentChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: top.map((item) => item.name || 'Sin residente'),
          datasets: [
            {
              data: top.map((item) => item.count || item.total || 0),
              backgroundColor: [
                '#0f766e',
                '#0d9488',
                '#14b8a6',
                '#2dd4bf',
                '#5eead4',
                '#99f6e4',
                '#ccfbf1',
                '#f0fdfa',
                '#e2e8f0',
                '#cbd5e1',
              ],
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

    // 3. Accesos por hora
    if (this.perHour.length > 0 && this.hourChartRef) {
      if (this.hourChart) this.hourChart.destroy();
      const ctx = this.hourChartRef.nativeElement.getContext('2d');
      if (!ctx) return;
      this.hourChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.perHour.map((item) => `${item.hour}:00`),
          datasets: [
            {
              label: 'Accesos',
              data: this.perHour.map((item) => item.count),
              backgroundColor: 'rgba(59, 130, 246, 0.6)',
              borderColor: '#3b82f6',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
            x: { ticks: { maxRotation: 45, minRotation: 0 } },
          },
        },
      });
    }

    // 4. Top 5 visitantes
    if (this.topVisitors.length > 0 && this.visitorChartRef) {
      if (this.visitorChart) this.visitorChart.destroy();
      const ctx = this.visitorChartRef.nativeElement.getContext('2d');
      if (!ctx) return;
      const labels = this.topVisitors.map((item) => item.name);
      const data = this.topVisitors.map((item) => item.count);
      this.visitorChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Visitas',
              data: data,
              backgroundColor: 'rgba(236, 72, 153, 0.6)',
              borderColor: '#ec4899',
              borderWidth: 1,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true, ticks: { stepSize: 1 } },
          },
        },
      });
    }
  }

  onFilterChange() {
    this.currentPage = 1;
    this.load();
  }

  onVehiclePlateChange() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.load();
    }, 400);
  }

  clearFilters() {
    this.filters = {
      startDate: '',
      endDate: '',
      residentId: null,
      vehiclePlate: '',
    };
    this.currentPage = 1;
    this.dateError = '';
    this.load();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
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

  async viewDetails(log: AccessLog) {
    const message = `
Residente: ${this.getResidentName(log.residentId)}
Vehículo: ${this.getVehiclePlate(log.vehicleId)}
Visitante: ${this.getVisitorName(log.visitorId)}
Entrada: ${new Date(log.entryDatetime).toLocaleString()}
Salida: ${log.exitDatetime ? new Date(log.exitDatetime).toLocaleString() : 'Pendiente'}
Estado: ${log.exitDatetime ? 'Completado' : 'Pendiente'}
    `;
    const alert = await this.alertController.create({
      header: `Acceso #${log.id}`,
      message: message,
      buttons: ['Cerrar'],
      cssClass: 'detail-alert',
    });
    await alert.present();
  }

  // ------------------- EXPORTAR PDF (página actual) -------------------
  exportReportPDF() {
    this.generatePDF(this.logs, 'reporte_accesos_pagina.pdf');
  }

  // ------------------- EXPORTAR PDF (todos los registros) -------------------
  exportFullReportPDF() {
    // Mostrar loading solo para el botón, no para ocultar gráficos
    // Pero necesitamos un indicador de carga, lo haremos con un toast o un spinner global
    // Usaremos loading para mostrar un spinner en el botón, pero no ocultamos gráficos
    // Para no ocultar gráficos, no usaremos el loading de la página,
    // sino un estado local para el botón.
    // Sin embargo, simplificaremos: no usamos loading para ocultar gráficos,
    // solo mostramos un toast de "Generando..."
    // Pero mantendremos loading para el indicador, y al finalizar, renderizamos gráficos de nuevo.
    this.loading = true;
    const params: any = {
      page: 1,
      limit: 9999,
    };
    if (this.filters.startDate) params.startDate = this.filters.startDate;
    if (this.filters.endDate) params.endDate = this.filters.endDate;
    if (this.filters.residentId) params.residentId = this.filters.residentId;
    if (this.filters.vehiclePlate)
      params.vehiclePlate = this.filters.vehiclePlate;

    this.api
      .getReport(params)
      .pipe(
        finalize(() => {
          this.loading = false;
          // Después de finalizar, volver a renderizar gráficos
          setTimeout(() => {
            this.renderCharts();
          }, 100);
        }),
      )
      .subscribe({
        next: (result: any) => {
          const allLogs = result.logs?.data || [];
          const totalAll = result.logs?.total || 0;
          this.generatePDF(allLogs, 'reporte_accesos_completo.pdf', totalAll);
        },
        error: (err) => {
          console.error('Error al exportar todo:', err);
          this.loading = false;
          // Mostrar un toast o alert de error
        },
      });
  }

  // ------------------- GENERADOR DE PDF (común) -------------------
  private generatePDF(
    data: AccessLog[],
    filename: string,
    totalRecords?: number,
  ) {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Logo
    const logoUrl = 'assets/icon/paraiso_Verde.png';
    const img = new Image();
    img.src = logoUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 14, 10, 25, 25);
      this.generatePDFContent(doc, data, filename, totalRecords);
    };
    img.onerror = () => {
      console.warn('No se pudo cargar el logo, continuando sin él.');
      this.generatePDFContent(doc, data, filename, totalRecords);
    };
  }

  private generatePDFContent(
    doc: jsPDF,
    data: AccessLog[],
    filename: string,
    totalRecords?: number,
  ) {
    const pageWidth = doc.internal.pageSize.getWidth();

    // Título
    doc.setFontSize(20);
    doc.text('Sistema Seguridad - Paraíso Verde', pageWidth / 2, 20, {
      align: 'center',
    });
    doc.setFontSize(12);
    doc.text(
      `Reporte de accesos - Generado: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      28,
      { align: 'center' },
    );
    doc.text(
      `Usuario: ${this.auth.currentUser?.username || 'admin'}`,
      pageWidth / 2,
      34,
      { align: 'center' },
    );

    // Filtros
    let filterText = 'Todos los registros';
    if (this.filters.startDate && this.filters.endDate) {
      filterText = `Desde ${this.filters.startDate} hasta ${this.filters.endDate}`;
    } else if (this.filters.startDate) {
      filterText = `Desde ${this.filters.startDate}`;
    } else if (this.filters.endDate) {
      filterText = `Hasta ${this.filters.endDate}`;
    }
    if (this.filters.residentId) {
      const resident = this.residents.find(
        (r) => r.id === this.filters.residentId,
      );
      filterText += ` · Residente: ${resident?.name || 'N/A'}`;
    }
    if (this.filters.vehiclePlate) {
      filterText += ` · Placa: ${this.filters.vehiclePlate}`;
    }
    doc.setFontSize(10);
    doc.text(`Filtro: ${filterText}`, 14, 44);

    // Resumen
    const total = totalRecords || data.length;
    doc.setFontSize(11);
    doc.text(`Total registros: ${total}`, 14, 52);
    doc.text(`Accesos hoy: ${this.todayAccesses}`, 14, 58);
    doc.text(`Pendientes: ${this.pendingAccesses}`, 14, 64);

    // Tabla
    const tableData = data.map((log) => [
      `#${log.id}`,
      this.getResidentName(log.residentId),
      this.getVehiclePlate(log.vehicleId),
      this.getVisitorName(log.visitorId),
      new Date(log.entryDatetime).toLocaleString(),
      log.exitDatetime
        ? new Date(log.exitDatetime).toLocaleString()
        : 'Pendiente',
      log.exitDatetime ? 'Completado' : 'Pendiente',
    ]);

    autoTable(doc, {
      head: [
        [
          'ID',
          'Residente',
          'Vehículo',
          'Visitante',
          'Entrada',
          'Salida',
          'Estado',
        ],
      ],
      body: tableData,
      startY: 72,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [15, 118, 110] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Pie de página
    const pageCount = doc.internal.pages.length;
    for (let i = 1; i < pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Página ${i} de ${pageCount - 1}`,
        pageWidth - 30,
        doc.internal.pageSize.getHeight() - 10,
      );
      doc.text(
        'Sistema Seguridad - Paraíso Verde',
        14,
        doc.internal.pageSize.getHeight() - 10,
      );
    }

    doc.save(filename);
  }
}
