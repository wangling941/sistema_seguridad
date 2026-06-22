import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { finalize } from 'rxjs';
import { Visitor } from '../../../core/models';
import { Api } from '../../../core/services/api';
import { VisitorFormComponent } from '../visitor-form/visitor-form.component';

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

  constructor(
    private api: Api,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.api
      .getVisitors(this.search, 1, 50)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((result) => {
        this.visitors = result.data;
        this.total = result.total;
      });
  }

  async openForm(visitor?: Visitor) {
    const modal = await this.modalController.create({
      component: VisitorFormComponent,
      componentProps: { visitor },
    });
    modal.onWillDismiss().then(() => this.load());
    await modal.present();
  }

  async deleteVisitor(visitor: Visitor) {
    const alert = await this.alertController.create({
      header: 'Eliminar visitante',
      message: `¿Eliminar a ${visitor.name}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.api.deleteVisitor(visitor.id).subscribe({
              next: () => {
                this.toast('Visitante eliminado');
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
