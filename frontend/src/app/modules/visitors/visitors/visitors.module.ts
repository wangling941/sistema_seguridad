import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VisitorsPageRoutingModule } from './visitors-routing.module';
import { VisitorsPage } from './visitors.page';
import { VisitorFormComponent } from '../visitor-form/visitor-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    VisitorsPageRoutingModule,
  ],
  declarations: [VisitorsPage, VisitorFormComponent],
})
export class VisitorsPageModule {}
