import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { AccessLog, Resident, Vehicle } from '../../../core/models';
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
  search = '';
  total = 0;
  loading = false;
  form: Partial<AccessLog> = { residentId: null, vehicleId: null };

  constructor(
    private api: Api,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.load();
    this.api
      .getResidents('', 1, 200)
      .subscribe((res) => (this.residents = res.data));
    this.api
      .getVehicles('', 1, 200)
      .subscribe((res) => (this.vehicles = res.data));
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

  createEntry() {
    const payload = {
      residentId: this.form.residentId || null,
      vehicleId: this.form.vehicleId || null,
      entryDatetime: new Date().toISOString(),
    };
    this.api.createAccessLog(payload).subscribe({
      next: () => {
        this.form = { residentId: null, vehicleId: null };
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
    return this.residents.find((r) => r.id === id)?.name || 'Sin residente';
  }

  getVehiclePlate(id: number | null): string {
    return this.vehicles.find((v) => v.id === id)?.plate || 'Sin vehículo';
  }

  private async toast(
    message: string,
    color: 'success' | 'danger' = 'success',
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
