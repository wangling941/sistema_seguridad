import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Auth } from '../../../core/services/auth';
import { Api } from '../../../core/services/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  username = '';
  password = '';
  confirmPassword = '';
  loading = false;

  constructor(
    private auth: Auth,
    private api: Api,
    private router: Router,
    private toastController: ToastController,
  ) {}

  register(): void {
    if (!this.username || !this.password || !this.confirmPassword) {
      this.presentToast('Completa todos los campos', 'warning');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.presentToast('Las contraseñas no coinciden', 'warning');
      return;
    }
    if (this.password.length < 6) {
      this.presentToast(
        'La contraseña debe tener al menos 6 caracteres',
        'warning',
      );
      return;
    }

    this.loading = true;
    // Llamada al endpoint de registro (aún no implementado en backend, pero lo dejamos listo)
    this.api.register(this.username, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.presentToast(
          'Cuenta creada exitosamente. Ahora inicia sesión.',
          'success',
        );
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.loading = false;
        this.presentToast(
          err.error?.message || 'Error al crear la cuenta',
          'danger',
        );
      },
    });
  }

  goToLogin(): void {
    this.router.navigateByUrl('/login');
  }

  private async presentToast(
    message: string,
    color: 'success' | 'danger' | 'warning',
  ) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 3000,
      position: 'top',
    });
    await toast.present();
  }
}
