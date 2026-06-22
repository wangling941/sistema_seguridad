import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { Auth } from '../../../core/services/auth';
import { Notification } from '../../../core/services/notification';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  username = 'admin';
  password = '';
  loading = false;

  constructor(
    private auth: Auth,
    private notifications: Notification,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  login(): void {
    if (!this.username || !this.password) {
      this.presentToast('Ingresa usuario y contraseña', 'warning');
      return;
    }
    this.loading = true;
    this.auth
      .login(this.username.trim(), this.password)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.notifications.connect();
          const returnUrl =
            this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
          this.router.navigateByUrl(returnUrl);
        },
        error: () =>
          this.presentToast(
            'Credenciales inválidas o backend no disponible',
            'danger',
          ),
      });
  }

  goToRegister(): void {
    this.router.navigateByUrl('/register');
  }

  private async presentToast(
    message: string,
    color: 'danger' | 'warning' = 'danger',
  ): Promise<void> {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2500,
      position: 'top',
    });
    await toast.present();
  }
}
