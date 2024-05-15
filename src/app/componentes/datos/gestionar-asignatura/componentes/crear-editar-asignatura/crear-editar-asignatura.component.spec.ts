import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarAsignaturaComponent } from './crear-editar-asignatura.component';

describe('CrearEditarAsignaturaComponent', () => {
  let component: CrearEditarAsignaturaComponent;
  let fixture: ComponentFixture<CrearEditarAsignaturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearEditarAsignaturaComponent]
    });
    fixture = TestBed.createComponent(CrearEditarAsignaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
