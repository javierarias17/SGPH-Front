import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarPeriodoAcademicoComponent } from './crear-editar-periodo-academico.component';

describe('CrearEditarPeriodoAcademicoComponent', () => {
  let component: CrearEditarPeriodoAcademicoComponent;
  let fixture: ComponentFixture<CrearEditarPeriodoAcademicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearEditarPeriodoAcademicoComponent]
    });
    fixture = TestBed.createComponent(CrearEditarPeriodoAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
