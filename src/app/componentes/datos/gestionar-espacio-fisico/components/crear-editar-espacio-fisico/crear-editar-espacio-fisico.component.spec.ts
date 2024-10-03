import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarEspacioFisicoComponent } from './crear-editar-espacio-fisico.component';

describe('CrearEditarEspacioFisicoComponent', () => {
  let component: CrearEditarEspacioFisicoComponent;
  let fixture: ComponentFixture<CrearEditarEspacioFisicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearEditarEspacioFisicoComponent]
    });
    fixture = TestBed.createComponent(CrearEditarEspacioFisicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
