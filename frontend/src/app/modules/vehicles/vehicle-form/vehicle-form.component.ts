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
        [Validators.required, Validators.pattern(/^[A-Za-z0-9\-]+$/)],
      ],
      residentId: [this.vehicle?.residentId || null],
    });
  }

  save() {
    if (this.form.invalid) return;
    const obs = this.vehicle
      ? this.api.updateVehicle(this.vehicle.id, this.form.value)
      : this.api.createVehicle(this.form.value);
    obs.subscribe({
      next: () => this.modalController.dismiss(true),
      error: () => alert('Error al guardar'),
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
