import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Resident, Vehicle } from '../../../core/models';
import { Api } from '../../../core/services/api';

@Component({
  selector: 'app-vehicle-form',
  templateUrl: './vehicle-form.component.html',
  styleUrls: ['./vehicle-form.component.scss'],
  standalone: false,
})
export class VehicleFormComponent implements OnInit {
  @Input() vehicle?: Vehicle;
  form!: FormGroup;
  residents: Resident[] = [];

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.api
      .getResidents('', 1, 200)
      .subscribe((res) => (this.residents = res.data));

    this.form = this.fb.group({
      plate: [
        this.vehicle?.plate || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(/^[A-Za-z0-9\-]+$/),
        ],
      ],
      residentId: [this.vehicle?.residentId || null],
    });

    // Formatear placa a mayúsculas automáticamente
    this.form.get('plate')?.valueChanges.subscribe((value: string) => {
      if (value) {
        const upper = value.toUpperCase();
        if (upper !== value) {
          this.form.patchValue({ plate: upper }, { emitEvent: false });
        }
      }
    });
  }

  // Método adicional para formatear al perder el foco
  formatPlate() {
    const control = this.form.get('plate');
    if (control?.value) {
      const upper = control.value.toUpperCase();
      if (upper !== control.value) {
        control.setValue(upper, { emitEvent: false });
      }
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value;
    const obs = this.vehicle
      ? this.api.updateVehicle(this.vehicle.id, data)
      : this.api.createVehicle(data);

    obs.subscribe({
      next: () => {
        this.modalController.dismiss(true);
      },
      error: () => {
        // Aquí podrías mostrar un toast de error
        console.error('Error al guardar');
      },
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
