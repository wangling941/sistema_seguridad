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
    this.load();
  }

  load() {
    this.loading = true;
    this.api
      .getVisitors(this.search, this.currentPage, this.pageSize)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (result) => {
          this.visitors = result.data;
          this.total = result.total;
          this.totalPages = Math.ceil(this.total / this.pageSize);
          if (this.currentPage > this.totalPages) {
            this.currentPage = 1;
            this.load();
          }
        },
        error: () => {
          this.toast('Error al cargar visitantes', 'danger');
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
      header: `Eliminar visitante "${visitor.name}"`,
      message:
        '¿Estás seguro de que deseas eliminar este visitante? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.api.deleteVisitor(visitor.id).subscribe({
              next: () => {
                this.toast('Visitante eliminado correctamente', 'success');
                this.load();
              },
              error: () => {
                this.toast('No se pudo eliminar el visitante', 'danger');
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
