import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResidentsPageRoutingModule } from './residents-routing.module';

import { ResidentsPage } from './residents.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResidentsPageRoutingModule
  ],
  declarations: [ResidentsPage]
})
export class ResidentsPageModule {}
