import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarEspacioFisicoComponent } from './asignar-espacio-fisico.component';

describe('AsignarEspacioFisicoComponent', () => {
  let component: AsignarEspacioFisicoComponent;
  let fixture: ComponentFixture<AsignarEspacioFisicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsignarEspacioFisicoComponent]
    });
    fixture = TestBed.createComponent(AsignarEspacioFisicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
