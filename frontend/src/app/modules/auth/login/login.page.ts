import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { Auth } from '../../../core/services/auth';
import { Notification } from '../../../core/services/notification';

// Validación personalizada: solo letras y números
const alphanumericValidator = Validators.pattern(/^[a-zA-Z0-9]+$/);

// Validación de contraseña fuerte: al menos una letra y un número
const strongPasswordValidator = Validators.pattern(
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
);

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private notifications: Notification,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    // Inicializar formulario con validaciones
    this.loginForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.minLength(3), alphanumericValidator],
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6), strongPasswordValidator],
      ],
    });

    // Si ya está autenticado, redirigir
    if (this.auth.isAuthenticated()) {
      this.router.navigateByUrl('/dashboard');
    }
  }

  // Getters para facilitar el acceso en el template
  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }

  login(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { username, password } = this.loginForm.value;

    this.auth
      .login(username.trim(), password)
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
    color: 'danger' | 'warning' | 'success' = 'danger',
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
