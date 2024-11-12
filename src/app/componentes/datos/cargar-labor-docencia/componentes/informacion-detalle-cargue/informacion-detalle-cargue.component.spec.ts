import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionDetalleCargueComponent } from './informacion-detalle-cargue.component';

describe('InformacionDetalleCargueComponent', () => {
  let component: InformacionDetalleCargueComponent;
  let fixture: ComponentFixture<InformacionDetalleCargueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InformacionDetalleCargueComponent]
    });
    fixture = TestBed.createComponent(InformacionDetalleCargueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
