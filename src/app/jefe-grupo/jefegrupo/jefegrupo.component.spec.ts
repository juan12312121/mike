import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefegrupoComponent } from './jefegrupo.component';

describe('JefegrupoComponent', () => {
  let component: JefegrupoComponent;
  let fixture: ComponentFixture<JefegrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JefegrupoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JefegrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
