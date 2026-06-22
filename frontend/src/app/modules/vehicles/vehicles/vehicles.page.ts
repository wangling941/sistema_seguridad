import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { Resident, Vehicle } from '../../../core/models';
import { Api } from '../../../core/services/api';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
  standalone: false,
})
export class VehiclesPage implements OnInit {
  vehicles: Vehicle[] = [];
  residents: Resident[] = [];
  total = 0;
  search = '';
  loading = false;
  editingId: number | null = null;
  form: Partial<Vehicle> = { plate: '', residentId: null };

  constructor(
    private api: Api,
    private alertController: AlertController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.load();
    this.api.getResidents('', 1, 200).subscribe((result) => (this.residents = result.data));
  }

  load(): void {
    this.loading = true;
    this.api.getVehicles(this.search, 1, 50)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((result) => {
        this.vehicles = result.data;
        this.total = result.total;
      });
  }

  save(): void {
    const payload = {
      plate: this.form.plate?.trim().toUpperCase(),
      residentId: this.form.residentId || null,
    };
    const request = this.editingId ? this.api.updateVehicle(this.editingId, payload) : this.api.createVehicle(payload);
    request.subscribe({
      next: () => {
        this.resetForm();
        this.load();
        this.toast(this.editingId ? 'Vehiculo actualizado' : 'Vehiculo creado');
      },
      error: () => this.toast('No se pudo guardar el vehiculo', 'danger'),
    });
  }

  edit(vehicle: Vehicle): void {
    this.editingId = vehicle.id;
    this.form = { ...vehicle };
  }

  resetForm(): void {
    this.editingId = null;
    this.form = { plate: '', residentId: null };
  }

  residentName(id: number | null): string {
    return this.residents.find((resident) => resident.id === id)?.name || 'Sin residente';
  }

  async remove(vehicle: Vehicle): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar vehiculo',
      message: `Se eliminara la placa ${vehicle.plate}.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.api.deleteVehicle(vehicle.id).subscribe({
            next: () => {
              this.load();
              this.toast('Vehiculo eliminado');
            },
            error: () => this.toast('No se pudo eliminar', 'danger'),
          }),
        },
      ],
    });
    await alert.present();
  }

  private async toast(message: string, color: 'success' | 'danger' = 'success'): Promise<void> {
    const toast = await this.toastController.create({ message, color, duration: 2200, position: 'top' });
    await toast.present();
  }
}
