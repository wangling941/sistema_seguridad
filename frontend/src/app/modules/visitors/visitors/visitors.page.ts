import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { Visitor } from '../../../core/models';
import { Api } from '../../../core/services/api';

@Component({
  selector: 'app-visitors',
  templateUrl: './visitors.page.html',
  styleUrls: ['./visitors.page.scss'],
  standalone: false,
})
export class VisitorsPage implements OnInit {
  visitors: Visitor[] = [];
  total = 0;
  search = '';
  loading = false;
  editingId: number | null = null;
  form: Partial<Visitor> = {
    name: '',
    dni: '',
    hasVehicle: false,
    vehiclePlate: null,
    companionsCount: 0,
    status: 'active',
  };

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
    this.api.getVisitors(this.search, 1, 50)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((result) => {
        this.visitors = result.data;
        this.total = result.total;
      });
  }

  save(): void {
    const payload = {
      name: this.form.name?.trim(),
      dni: this.form.dni?.trim(),
      hasVehicle: Boolean(this.form.hasVehicle),
      vehiclePlate: this.form.hasVehicle ? this.form.vehiclePlate?.trim().toUpperCase() : null,
      companionsCount: Number(this.form.companionsCount || 0),
      status: this.form.status || 'active',
    };
    const request = this.editingId ? this.api.updateVisitor(this.editingId, payload) : this.api.createVisitor(payload);
    const wasEditing = Boolean(this.editingId);
    request.subscribe({
      next: () => {
        this.resetForm();
        this.load();
        this.toast(wasEditing ? 'Visitante actualizado' : 'Visitante creado');
      },
      error: () => this.toast('No se pudo guardar el visitante', 'danger'),
    });
  }

  edit(visitor: Visitor): void {
    this.editingId = visitor.id;
    this.form = { ...visitor };
  }

  resetForm(): void {
    this.editingId = null;
    this.form = {
      name: '',
      dni: '',
      hasVehicle: false,
      vehiclePlate: null,
      companionsCount: 0,
      status: 'active',
    };
  }

  async remove(visitor: Visitor): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Eliminar visitante',
      message: `Se eliminara a ${visitor.name}.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.api.deleteVisitor(visitor.id).subscribe({
            next: () => {
              this.load();
              this.toast('Visitante eliminado');
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
