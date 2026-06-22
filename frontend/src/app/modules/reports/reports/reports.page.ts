import { Component, OnInit } from '@angular/core';
import { AccessLog, Resident, Vehicle, Visitor } from '../../../core/models';
import { Api } from '../../../core/services/api';
import { Auth } from '../../../core/services/auth';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  perDay: any[] = [];
  perResident: any[] = [];

  filters = {
    startDate: '',
    endDate: '',
    residentId: null as number | null,
    vehiclePlate: '',
  };

  constructor(
    private api: Api,
    private auth: Auth,
  ) {}

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

    console.log('Enviando parámetros:', params);

    this.api.getReport(params).subscribe({
      next: (result: any) => {
        console.log('Resultado del reporte:', result);
        // CORRECCIÓN: acceder a result.logs.data y result.logs.total
        this.logs = result.logs?.data || [];
        this.total = result.logs?.total || 0;
        this.perDay = result.perDay || [];
        this.perResident = result.perResident || [];
      },
      error: (err) => {
        console.error('Error en reportes:', err);
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

  exportReportPDF() {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    // Cargar logo (usamos la imagen PNG)
    const logoUrl = 'assets/icon/paraiso_Verde.png';
    const img = new Image();
    img.src = logoUrl;
    // Esperar a que cargue (usamos un canvas para obtener la imagen)
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const imgElement = new Image();
    imgElement.src = logoUrl;
    imgElement.onload = () => {
      canvas.width = imgElement.width;
      canvas.height = imgElement.height;
      ctx.drawImage(imgElement, 0, 0);
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 14, 10, 25, 25);
      this.generatePDFContent(doc, pageWidth);
    };
    imgElement.onerror = () => {
      // Si no carga la imagen, continuar sin logo
      console.warn('No se pudo cargar el logo, continuando sin él.');
      this.generatePDFContent(doc, pageWidth);
    };
  }

  private generatePDFContent(doc: jsPDF, pageWidth: number) {
    // Título
    doc.setFontSize(18);
    doc.text('Sistema Seguridad - Paraíso Verde', pageWidth / 2, 20, {
      align: 'center',
    });
    doc.setFontSize(11);
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

    // Filtros aplicados
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
    doc.text(`Filtro: ${filterText}`, 14, 42);

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
      startY: 48,
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
}
