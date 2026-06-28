import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResidentsPageRoutingModule } from './residents-routing.module';
import { ResidentsPage } from './residents.page';
import { ResidentFormComponent } from '../resident-form/resident-form.component';
import { ResidentDetailComponent } from '../resident-detail/resident-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ResidentsPageRoutingModule,
  ],
  declarations: [ResidentsPage, ResidentFormComponent, ResidentDetailComponent],
})
export class ResidentsPageModule {}
