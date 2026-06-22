import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { Resident } from '../../../core/models';
import { Api } from '../../../core/services/api';

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
  editingId: number | null = null;
  form: Partial<Resident> = { name: '', dni: '', status: 'active' };

  constructor(
    private api: Api,
    private alertController: AlertController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getResidents(this.search, 1, 50)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((result) => {
        this.residents = result.data;
        this.total = result.total;
      });
  }

  save(): void {
    const payload = {
      name: this.form.name?.trim(),
      dni: this.form.dni?.trim(),
      status: this.form.status || 'active',
    };

    const request = this.editingId
      ? this.api.updateResident(this.editingId, payload)
      : this.api.createResident(payload);

    request.subscribe({
      next: () => {
        this.resetForm();
        this.load();
        this.toast(this.editingId ? 'Residente actualizado' : 'Residente creado');
      },
      error: () => this.toast('No se pudo guardar el residente', 'danger'),
    });
  }

  edit(resident: Resident): void {
    this.editingId = resident.id;
    this.form = { ...resident };
  }

  resetForm(): void {
    this.editingId = null;
    this.form = { name: '', dni: '', status: 'active' };
  }

  async remove(resident: Resident): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar residente',
      message: `Se eliminara a ${resident.name}.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.api.deleteResident(resident.id).subscribe({
              next: () => {
                this.load();
                this.toast('Residente eliminado');
              },
              error: () => this.toast('No se pudo eliminar', 'danger'),
            });
          },
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
