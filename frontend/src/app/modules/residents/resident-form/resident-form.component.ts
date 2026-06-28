import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Resident } from '../../../core/models';
import { Api } from '../../../core/services/api';

@Component({
  selector: 'app-resident-form',
  templateUrl: './resident-form.component.html',
  styleUrls: ['./resident-form.component.scss'],
  standalone: false,
})
export class ResidentFormComponent implements OnInit {
  @Input() resident?: Resident;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [
        this.resident?.name || '',
        [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)],
      ],
      dni: [
        this.resident?.dni || '',
        [Validators.required, Validators.pattern(/^[0-9]{8}$/)],
      ],
      status: [this.resident?.status || 'active', Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) {
      // Marcar todos los campos como tocados para mostrar errores
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value;
    const obs = this.resident
      ? this.api.updateResident(this.resident.id, data)
      : this.api.createResident(data);

    obs.subscribe({
      next: () => {
        this.modalController.dismiss(true);
      },
      error: () => {
        // Podrías mostrar un toast aquí
        console.error('Error al guardar');
      },
    });
  }

  dismiss(): void {
    this.modalController.dismiss();
  }
}
