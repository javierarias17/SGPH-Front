import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarGrupoComponent } from './crear-editar-grupo.component';

describe('CrearEditarGrupoComponent', () => {
  let component: CrearEditarGrupoComponent;
  let fixture: ComponentFixture<CrearEditarGrupoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearEditarGrupoComponent]
    });
    fixture = TestBed.createComponent(CrearEditarGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
