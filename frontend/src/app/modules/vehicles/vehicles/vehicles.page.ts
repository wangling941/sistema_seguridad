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

  // Paginación
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  private searchTimeout: any;

  constructor(
    private api: Api,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.loadResidents();
    this.load();
  }

  loadResidents() {
    this.api.getResidents('', 1, 200).subscribe((res) => {
      this.residents = res.data;
    });
  }

  load() {
    this.loading = true;
    this.api
      .getVehicles(this.search, this.currentPage, this.pageSize)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (result) => {
          this.vehicles = result.data;
          this.total = result.total;
          this.totalPages = Math.ceil(this.total / this.pageSize);
          // Ajustar página actual si es mayor al total
          if (this.currentPage > this.totalPages) {
            this.currentPage = 1;
            // Recargar con la página corregida
            this.load();
          }
        },
        error: () => {
          this.toast('Error al cargar vehículos', 'danger');
        },
      });
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.load();
  }

  onSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.load();
    }, 400);
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
    if (!id) return 'Sin residente';
    const resident = this.residents.find((r) => r.id === id);
    return resident ? resident.name : 'Sin residente';
  }

  async deleteVehicle(vehicle: Vehicle) {
    const alert = await this.alertController.create({
      header: `Eliminar vehículo "${vehicle.plate}"`,
      message:
        '¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.api.deleteVehicle(vehicle.id).subscribe({
              next: () => {
                this.toast('Vehículo eliminado correctamente', 'success');
                this.load();
              },
              error: () => {
                this.toast('No se pudo eliminar el vehículo', 'danger');
              },
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
      duration: 2500,
      position: 'bottom',
      cssClass: 'custom-toast',
      buttons: [
        {
          icon: 'close-outline',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }
}
