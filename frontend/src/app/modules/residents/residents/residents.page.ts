import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { finalize } from 'rxjs';
import { Resident } from '../../../core/models';
import { Api } from '../../../core/services/api';
import { ResidentFormComponent } from '../resident-form/resident-form.component';

@Component({
  selector: 'app-residents',
  templateUrl: './residents.page.html',
  styleUrls: ['./residents.page.scss'],
  standalone: false,
})
export class ResidentsPage implements OnInit {
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
  }

  load(): void {
    this.loading = true;
    this.api
      .getResidents(this.search, 1, 50)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (result) => {
          this.residents = result.data;
          this.total = result.total;
        },
        error: (err) => {
          this.toast('Error al cargar residentes', 'danger');
        },
      });
  }

  async openForm(resident?: Resident): Promise<void> {
    const modal = await this.modalController.create({
      component: ResidentFormComponent,
      componentProps: { resident },
    });
    modal.onWillDismiss().then(() => this.load());
    await modal.present();
  }

  async deleteResident(resident: Resident): Promise<void> {
    // Mensaje sin etiquetas HTML – usamos el header para el nombre
    const alert = await this.alertController.create({
      header: `Eliminar a "${resident.name}"`,
      message: `¿Estás seguro de que deseas eliminar este residente? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.api.deleteResident(resident.id).subscribe({
              next: () => {
                this.toast('Residente eliminado correctamente', 'success');
                this.load();
              },
              error: () => {
                this.toast('No se pudo eliminar el residente', 'danger');
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
