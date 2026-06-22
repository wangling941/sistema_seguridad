import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResidentsPage } from './residents.page';

const routes: Routes = [
  {
    path: '',
    component: ResidentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResidentsPageRoutingModule {}
