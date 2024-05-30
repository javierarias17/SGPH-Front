import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaPrincipalPeriodoAcademicoComponent } from './bandeja-principal-periodo-academico.component';

describe('BandejaPrincipalPeriodoAcademicoComponent', () => {
  let component: BandejaPrincipalPeriodoAcademicoComponent;
  let fixture: ComponentFixture<BandejaPrincipalPeriodoAcademicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BandejaPrincipalPeriodoAcademicoComponent]
    });
    fixture = TestBed.createComponent(BandejaPrincipalPeriodoAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
