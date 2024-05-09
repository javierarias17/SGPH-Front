import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCargaAsignaturasComponent } from './detalle-carga-asignaturas.component';

describe('DetalleCargaAsignaturasComponent', () => {
  let component: DetalleCargaAsignaturasComponent;
  let fixture: ComponentFixture<DetalleCargaAsignaturasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleCargaAsignaturasComponent]
    });
    fixture = TestBed.createComponent(DetalleCargaAsignaturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
