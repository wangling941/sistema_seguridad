import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Resident } from '../../../core/models';

@Component({
  selector: 'app-resident-detail',
  templateUrl: './resident-detail.component.html',
  styleUrls: ['./resident-detail.component.scss'],
  standalone: false,
})
export class ResidentDetailComponent implements OnInit {
  @Input() resident!: Resident;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }
}
