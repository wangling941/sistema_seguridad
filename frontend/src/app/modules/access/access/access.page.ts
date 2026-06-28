import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { AccessLog, Resident, Vehicle, Visitor } from '../../../core/models';
import { Api } from '../../../core/services/api';

@Component({
  selector: 'app-access',
  templateUrl: './access.page.html',
  styleUrls: ['./access.page.scss'],
  standalone: false,
})
export class AccessPage implements OnInit {
  logs: AccessLog[] = [];
  residents: Resident[] = [];
  vehicles: Vehicle[] = [];
  visitors: Visitor[] = [];
  filteredVehicles: Vehicle[] = [];
  search = '';
  total = 0;
  loading = false;
  page = 1;
  limit = 10;

  // Exponer Math para usar en la plantilla
  public Math = Math;

  entryType: 'resident' | 'vehicle' | 'visitor' = 'resident';

  form: {
    residentId: number | null;
    vehicleId: number | null;
    visitorId: number | null;
  } = {
    residentId: null,
    vehicleId: null,
    visitorId: null,
  };

  constructor(
    private api: Api,
    private toastController: ToastController,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.load();
    this.loadSelects();
  }

  loadSelects() {
    this.api
      .getResidents('', 1, 200)
      .subscribe((res) => (this.residents = res.data));
    this.api.getVehicles('', 1, 200).subscribe((res) => {
      this.vehicles = res.data;
      this.filteredVehicles = this.vehicles;
    });
    this.api
      .getVisitors('', 1, 200)
      .subscribe((res) => (this.visitors = res.data));
  }

  load() {
    this.loading = true;
    this.api
      .getAccessLogs(this.search, this.page, this.limit)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((result) => {
        this.logs = result.data;
        this.total = result.total;
      });
  }

  onTypeChange() {
    this.form = { residentId: null, vehicleId: null, visitorId: null };
    if (this.entryType === 'resident' || this.entryType === 'vehicle') {
      this.filteredVehicles = this.vehicles;
    }
  }

  onResidentChange() {
    if (this.form.residentId) {
      this.filteredVehicles = this.vehicles.filter(
        (v) => v.residentId === this.form.residentId,
      );
      this.form.vehicleId = null;
    } else {
      this.filteredVehicles = this.vehicles;
    }
  }

  onVisitorChange() {
    // Opcional: mostrar toast si el visitante tiene vehículo
    const visitor = this.visitors.find((v) => v.id === this.form.visitorId);
    if (visitor && visitor.hasVehicle && visitor.vehiclePlate) {
      // No es necesario hacer nada, solo mostramos la placa en la tabla
    }
  }

  createEntry() {
    // VALIDACIÓN: Debe seleccionar al menos un elemento (residente, vehículo o visitante)
    if (this.entryType === 'visitor') {
      if (!this.form.visitorId) {
        this.toast('Debes seleccionar un visitante', 'warning');
        return;
      }
    } else {
      // Para residente o vehículo: debe tener al menos residente o vehículo
      if (!this.form.residentId && !this.form.vehicleId) {
        this.toast('Debes seleccionar un residente o un vehículo', 'warning');
        return;
      }
    }

    const payload: any = {
      entryDatetime: new Date().toISOString(),
    };

    if (this.entryType === 'resident' || this.entryType === 'vehicle') {
      payload.residentId = this.form.residentId || null;
      payload.vehicleId = this.form.vehicleId || null;
    } else if (this.entryType === 'visitor') {
      payload.visitorId = this.form.visitorId;
    }

    this.api.createAccessLog(payload).subscribe({
      next: () => {
        this.form = { residentId: null, vehicleId: null, visitorId: null };
        this.load();
        this.toast('Entrada registrada');
      },
      error: (err) => {
        console.error('Error al registrar entrada:', err);
        this.toast('Error al registrar entrada', 'danger');
      },
    });
  }

  registerExit(log: AccessLog) {
    if (!log.id) return;
    this.api.registerExit(log.id).subscribe({
      next: () => {
        this.load();
        this.toast('Salida registrada');
      },
      error: () => this.toast('Error al registrar salida', 'danger'),
    });
  }

  async deleteAccess(log: AccessLog) {
    if (!log.id) return;
    const alert = await this.alertController.create({
      header: 'Eliminar acceso',
      message: `¿Estás seguro de eliminar el acceso #${log.id}? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.api.deleteAccessLog(log.id).subscribe({
              next: () => {
                this.load();
                this.toast('Acceso eliminado');
              },
              error: () => this.toast('Error al eliminar', 'danger'),
            });
          },
        },
      ],
    });
    await alert.present();
  }

  nextPage() {
    if (this.page * this.limit < this.total) {
      this.page++;
      this.load();
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.load();
    }
  }

  goToPage(page: number) {
    this.page = page;
    this.load();
  }

  getResidentName(id: number | null): string {
    const resident = this.residents.find((r) => r.id === id);
    return resident ? resident.name : 'Sin residente';
  }

  getVehiclePlate(log: AccessLog): string {
    if (log.vehicleId) {
      const vehicle = this.vehicles.find((v) => v.id === log.vehicleId);
      return vehicle ? vehicle.plate : 'Sin vehículo';
    }
    if (log.visitorId) {
      const visitor = this.visitors.find((v) => v.id === log.visitorId);
      if (visitor && visitor.hasVehicle && visitor.vehiclePlate) {
        return visitor.vehiclePlate;
      }
    }
    return 'Sin vehículo';
  }

  getVisitorName(id: number | null): string {
    const visitor = this.visitors.find((v) => v.id === id);
    return visitor ? visitor.name : 'Sin visitante';
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.total / this.limit);
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  private async toast(
    message: string,
    color: 'success' | 'danger' | 'warning' = 'success',
  ) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2200,
      position: 'top',
    });
    await toast.present();
  }
}
