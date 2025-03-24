import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAsistenciasComponent } from './registro-asistencias.component';

describe('RegistroAsistenciasComponent', () => {
  let component: RegistroAsistenciasComponent;
  let fixture: ComponentFixture<RegistroAsistenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroAsistenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroAsistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
