import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VehiclesPageRoutingModule } from './vehicles-routing.module';
import { VehiclesPage } from './vehicles.page';
import { VehicleFormComponent } from '../vehicle-form/vehicle-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // <-- AGREGADO
    IonicModule,
    VehiclesPageRoutingModule,
  ],
  declarations: [VehiclesPage, VehicleFormComponent],
})
export class VehiclesPageModule {}
