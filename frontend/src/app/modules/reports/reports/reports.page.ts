import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { AccessLog, Resident, Vehicle, Visitor } from '../../../core/models';
import { Api } from '../../../core/services/api';
import { Auth } from '../../../core/services/auth';
import { Chart, registerables } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  logs: AccessLog[] = [];
  total = 0;
  residents: Resident[] = [];
  vehicles: Vehicle[] = [];
  visitors: Visitor[] = [];
  perDay: any[] = [];
  perResident: any[] = [];

  // Filtros
  filters = {
    startDate: '',
    endDate: '',
    residentId: null as number | null,
    vehiclePlate: '',
  };

  // Paginación
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  // Estado
  loading = false;
  loadError = '';
  dateError = '';

  // Resumen
  todayAccesses = 0;
  pendingAccesses = 0;
  vehiclesUsed = 0;

  // Charts
  private dayChart: Chart | null = null;
  private residentChart: Chart | null = null;
  private searchTimeout: any;

  constructor(
    private api: Api,
    private auth: Auth,
    private toastController: ToastController,
    private modalController: ModalController,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.loadSelects();
    this.load();
  }

  ngAfterViewInit() {
    // Los gráficos se inicializan después de cargar los datos
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
    // Validar fechas
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
        this.totalPages = Math.ceil(this.total / this.pageSize);
        if (this.currentPage > this.totalPages) {
          this.currentPage = 1;
          this.load();
          return;
        }
        this.calculateSummary();
        this.renderCharts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error en reportes:', err);
        this.loadError = 'No se pudieron cargar los datos. Intenta nuevamente.';
        this.loading = false;
      },
    });
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
    if (this.perDay.length > 0 && this.dayChartRef) {
      if (this.dayChart) this.dayChart.destroy();
      const ctx = this.dayChartRef.nativeElement.getContext('2d');
      if (!ctx) return;
      this.dayChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.perDay.map((item) => item.date),
          datasets: [
            {
              label: 'Accesos',
              data: this.perDay.map((item) => item.count),
              backgroundColor: 'rgba(15, 118, 110, 0.6)',
              borderColor: '#0f766e',
              borderWidth: 1,
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
            y: { beginAtZero: true, ticks: { stepSize: 1 } },
          },
        },
      });
    }

    if (this.perResident.length > 0 && this.residentChartRef) {
      if (this.residentChart) this.residentChart.destroy();
      const ctx = this.residentChartRef.nativeElement.getContext('2d');
      if (!ctx) return;
      const topResidents = this.perResident.slice(0, 10);
      this.residentChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: topResidents.map((item) => item.name),
          datasets: [
            {
              data: topResidents.map((item) => item.count),
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
    // Puedes abrir un modal con el detalle completo
    const alert = await this.alertController.create({
      header: `Acceso #${log.id}`,
      message: `
        Residente: ${this.getResidentName(log.residentId)}
        Vehículo: ${this.getVehiclePlate(log.vehicleId)}
        Visitante: ${this.getVisitorName(log.visitorId)}
        Entrada: ${new Date(log.entryDatetime).toLocaleString()}
        Salida: ${log.exitDatetime ? new Date(log.exitDatetime).toLocaleString() : 'Pendiente'}
        Estado: ${log.exitDatetime ? 'Completado' : 'Pendiente'}
      `,
      buttons: ['Cerrar'],
    });
    await alert.present();
  }

  exportReportPDF() {
    const doc = new jsPDF('landscape', 'mm', 'a4');
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
    doc.setFontSize(11);
    doc.text(`Total registros: ${this.total}`, 14, 52);
    doc.text(`Accesos hoy: ${this.todayAccesses}`, 14, 58);
    doc.text(`Pendientes: ${this.pendingAccesses}`, 14, 64);

    // Tabla
    const tableData = this.logs.map((log) => [
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

    doc.save('reporte_accesos.pdf');
  }

  private async toast(
    message: string,
    color: 'success' | 'danger' = 'success',
  ) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2500,
      position: 'bottom',
      buttons: [{ icon: 'close-outline', role: 'cancel' }],
    });
    await toast.present();
  }
}
