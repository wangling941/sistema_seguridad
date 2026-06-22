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
      name: [this.visitor?.name || '', Validators.required],
      dni: [
        this.visitor?.dni || '',
        [Validators.required, Validators.pattern(/^[0-9]{8}$/)],
      ],
      status: [this.visitor?.status || 'active', Validators.required],
      hasVehicle: [this.visitor?.hasVehicle || false],
      vehiclePlate: [this.visitor?.vehiclePlate || ''],
      companionsCount: [this.visitor?.companionsCount || 0],
    });
  }

  save() {
    if (this.form.invalid) return;
    const data = this.form.value;
    const obs = this.visitor
      ? this.api.updateVisitor(this.visitor.id, data)
      : this.api.createVisitor(data);
    obs.subscribe({
      next: () => this.modalController.dismiss(true),
      error: () => alert('Error al guardar'),
    });
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
