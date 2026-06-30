import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Auth } from '../../../core/services/auth';
import { Api } from '../../../core/services/api';

// Validadores personalizados
const alphanumericValidator = Validators.pattern(/^[a-zA-Z0-9]+$/);
const strongPasswordValidator = Validators.pattern(
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
);

// Validador personalizado para comparar contraseñas
function mustMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  if (!password || !confirm) return null;
  return password.value === confirm.value ? null : { mustMatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  registerForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private api: Api,
    private router: Router,
    private toastController: ToastController,
  ) {
    this.registerForm = this.fb.group(
      {
        username: [
          '',
          [Validators.required, Validators.minLength(3), alphanumericValidator],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            strongPasswordValidator,
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: mustMatch, // validación a nivel de grupo
      },
    );
  }

  // Getters
  get username() {
    return this.registerForm.get('username');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  register(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    const { username, password } = this.registerForm.value;

    this.api.register(username, password).subscribe({
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
