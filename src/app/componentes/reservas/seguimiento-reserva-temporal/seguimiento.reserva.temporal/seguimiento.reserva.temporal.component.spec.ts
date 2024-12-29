import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoReservaTemporalComponent } from './seguimiento.reserva.temporal.component';

describe('SeguimientoReservaTemporalComponent', () => {
  let component: SeguimientoReservaTemporalComponent;
  let fixture: ComponentFixture<SeguimientoReservaTemporalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeguimientoReservaTemporalComponent]
    });
    fixture = TestBed.createComponent(SeguimientoReservaTemporalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
