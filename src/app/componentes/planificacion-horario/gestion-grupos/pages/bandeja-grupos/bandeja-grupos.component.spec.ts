import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaGruposComponent } from './bandeja-grupos.component';

describe('BandejaGruposComponent', () => {
  let component: BandejaGruposComponent;
  let fixture: ComponentFixture<BandejaGruposComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BandejaGruposComponent]
    });
    fixture = TestBed.createComponent(BandejaGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
