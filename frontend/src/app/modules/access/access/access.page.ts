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
  form: Partial<AccessLog> = {
    residentId: null,
    vehicleId: null,
  };

  constructor(
    private api: Api,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.load();
    this.api.getResidents('', 1, 200).subscribe((result) => (this.residents = result.data));
    this.api.getVehicles('', 1, 200).subscribe((result) => (this.vehicles = result.data));
  }

  load(): void {
    this.loading = true;
    this.api.getAccessLogs(this.search, 1, 50)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((result) => {
        this.logs = result.data;
        this.total = result.total;
      });
  }

  createEntry(): void {
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
      error: () => this.toast('No se pudo registrar la entrada', 'danger'),
    });
  }

  registerExit(log: AccessLog): void {
    this.api.registerExit(log.id).subscribe({
      next: () => {
        this.load();
        this.toast('Salida registrada');
      },
      error: () => this.toast('No se pudo registrar la salida', 'danger'),
    });
  }

  residentName(id: number | null): string {
    return this.residents.find((resident) => resident.id === id)?.name || 'Sin residente';
  }

  vehiclePlate(id: number | null): string {
    return this.vehicles.find((vehicle) => vehicle.id === id)?.plate || 'Sin vehiculo';
  }

  private async toast(message: string, color: 'success' | 'danger' = 'success'): Promise<void> {
    const toast = await this.toastController.create({ message, color, duration: 2200, position: 'top' });
    await toast.present();
  }
}
