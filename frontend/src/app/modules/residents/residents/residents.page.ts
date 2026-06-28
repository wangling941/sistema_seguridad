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

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Array de páginas para mostrar
  pages: number[] = [];

  constructor(
    private api: Api,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.load();
  }

  load(page: number = this.currentPage): void {
    this.loading = true;
    this.currentPage = page;

    this.api
      .getResidents(this.search, page, this.itemsPerPage)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (result) => {
          this.residents = result.data;
          this.total = result.total;
          this.totalPages = Math.ceil(this.total / this.itemsPerPage);
          this.generatePages();
        },
        error: () => {
          this.toast('Error al cargar residentes', 'danger');
        },
      });
  }

  // Generar array de páginas para mostrar
  private generatePages(): void {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    this.pages = pages;
  }

  // Cambiar a una página específica
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.load(page);
  }

  // Página anterior
  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  // Página siguiente
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  // Al buscar, resetear a página 1
  onSearch(event: any): void {
    this.currentPage = 1;
    this.load(1);
  }

  async openForm(resident?: Resident): Promise<void> {
    const modal = await this.modalController.create({
      component: ResidentFormComponent,
      componentProps: { resident },
    });
    modal.onWillDismiss().then(() => {
      // Recargar manteniendo la página actual
      this.load(this.currentPage);
    });
    await modal.present();
  }

  async deleteResident(resident: Resident): Promise<void> {
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
                this.load(this.currentPage);
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
