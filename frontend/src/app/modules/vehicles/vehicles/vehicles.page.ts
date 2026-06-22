import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { finalize } from 'rxjs';
import { Resident, Vehicle } from '../../../core/models';
import { Api } from '../../../core/services/api';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';

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

  constructor(
    private api: Api,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.load();
    this.api
      .getResidents('', 1, 200)
      .subscribe((res) => (this.residents = res.data));
  }

  load() {
    this.loading = true;
    this.api
      .getVehicles(this.search, 1, 50)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((result) => {
        this.vehicles = result.data;
        this.total = result.total;
      });
  }

  async openForm(vehicle?: Vehicle) {
    const modal = await this.modalController.create({
      component: VehicleFormComponent,
      componentProps: { vehicle },
    });
    modal.onWillDismiss().then(() => this.load());
    await modal.present();
  }

  getResidentName(id: number | null): string {
    return this.residents.find((r) => r.id === id)?.name || 'Sin residente';
  }

  async deleteVehicle(vehicle: Vehicle) {
    const alert = await this.alertController.create({
      header: 'Eliminar vehículo',
      message: `¿Eliminar placa ${vehicle.plate}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.api.deleteVehicle(vehicle.id).subscribe({
              next: () => {
                this.toast('Vehículo eliminado');
                this.load();
              },
              error: () => this.toast('Error al eliminar', 'danger'),
            });
          },
        },
      ],
    });
    await alert.present();
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
