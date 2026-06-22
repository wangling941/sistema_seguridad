import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
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
      .getAccessLogs(this.search, 1, 50)
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

  createEntry() {
    // Validación: si es visitante, debe seleccionar uno
    if (this.entryType === 'visitor' && !this.form.visitorId) {
      this.toast('Selecciona un visitante', 'warning');
      return;
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
      error: () => this.toast('Error al registrar entrada', 'danger'),
    });
  }

  registerExit(log: AccessLog) {
    this.api.registerExit(log.id).subscribe({
      next: () => {
        this.load();
        this.toast('Salida registrada');
      },
      error: () => this.toast('Error al registrar salida', 'danger'),
    });
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
