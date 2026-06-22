import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentsPage } from './residents.page';

describe('ResidentsPage', () => {
  let component: ResidentsPage;
  let fixture: ComponentFixture<ResidentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResidentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
