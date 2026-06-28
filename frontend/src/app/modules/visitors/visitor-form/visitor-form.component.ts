import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Visitor } from '../../../core/models';
import { Api } from '../../../core/services/api';

@Component({
  selector: 'app-visitor-form',
  templateUrl: './visitor-form.component.html',
  styleUrls: ['./visitor-form.component.scss'],
  standalone: false,
})
export class VisitorFormComponent implements OnInit {
  @Input() visitor?: Visitor;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: Api,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [
        this.visitor?.name || '',
        [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)],
      ],
      dni: [
        this.visitor?.dni || '',
        [Validators.required, Validators.pattern(/^[0-9]{8}$/)],
      ],
      status: [this.visitor?.status || 'active', Validators.required],
      hasVehicle: [this.visitor?.hasVehicle || false],
      vehiclePlate: [
        this.visitor?.vehiclePlate || '',
        [Validators.pattern(/^[A-Za-z0-9\-]+$/)],
      ],
      companionsCount: [
        this.visitor?.companionsCount ?? 0,
        [Validators.min(0)],
      ],
    });

    // Validación condicional: si hasVehicle es true, vehiclePlate es requerido
    this.form.get('hasVehicle')?.valueChanges.subscribe((hasVehicle) => {
      const plateControl = this.form.get('vehiclePlate');
      if (hasVehicle) {
        plateControl?.setValidators([
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9\-]+$/),
        ]);
      } else {
        plateControl?.clearValidators();
        plateControl?.setValue('');
      }
      plateControl?.updateValueAndValidity();
    });

    // Formatear placa a mayúsculas
    this.form.get('vehiclePlate')?.valueChanges.subscribe((value: string) => {
      if (value) {
        const upper = value.toUpperCase();
        if (upper !== value) {
          this.form.patchValue({ vehiclePlate: upper }, { emitEvent: false });
        }
      }
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.value;
    const obs = this.visitor
      ? this.api.updateVisitor(this.visitor.id, data)
      : this.api.createVisitor(data);

    obs.subscribe({
      next: () => {
        this.modalController.dismiss(true);
      },
      error: () => {
        console.error('Error al guardar');
      },
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
